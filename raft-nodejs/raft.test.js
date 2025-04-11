const { Raft, MemoryStorage } = require('./raft');
const { Message, Entry } = require('./raftpb');

test('TestProgressLeader', () => {
  const s = new MemoryStorage().withPeers([1, 2]);
  const r = new Raft(1, 5, 1, s);
  
  r.becomeCandidate();
  r.becomeLeader();
  r.trk.progress[2].becomeReplicate();

  // 发送提案到r1，前5个条目应该进入不稳定日志
  const propMsg = new Message({ 
    from: 1,
    to: 1,
    type: 'MsgProp',
    entries: [new Entry({data: Buffer.from('foo')})]
  });

  for (let i = 0; i < 5; i++) {
    expect(r.step(propMsg)).toBeUndefined(); // 确保没有错误
  }

  expect(r.trk.progress[1].match).toBe(0);

  const ents = r.raftLog.nextUnstableEnts();
  expect(ents.length).toBe(6);
  expect(ents[0].data.length).toBe(0); 
  expect(ents[5].data.toString()).toBe('foo');

  r.advanceMessagesAfterAppend();

  expect(r.trk.progress[1].match).toBe(6);
  expect(r.trk.progress[1].next).toBe(7);
});