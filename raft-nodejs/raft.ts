interface IEntry {
  data: Buffer;
}

interface IMessage {
  from: number;
  to: number;
  type: string;
  entries?: IEntry[];
}

class Progress {
  match: number = 0;
  next: number = 1;
  
  becomeReplicate() {
    // 实现复制状态转换
  }
}

class ProgressTracker {
  progress: Record<number, Progress> = {};
}

class RaftLog {
  unstable: IEntry[] = [];
  
  nextUnstableEnts(): IEntry[] {
    return this.unstable;
  }
}

class MemoryStorage {
  peers: number[] = [];
  
  withPeers(peers: number[]): this {
    this.peers = peers;
    return this;
  }
}

class Raft {
  id: number;
  electionTimeout: number;
  heartbeatTimeout: number;
  storage: MemoryStorage;
  trk: ProgressTracker;
  raftLog: RaftLog;
  
  constructor(id: number, electionTimeout: number, heartbeatTimeout: number, storage: MemoryStorage) {
    this.id = id;
    this.electionTimeout = electionTimeout;
    this.heartbeatTimeout = heartbeatTimeout;
    this.storage = storage;
    this.trk = new ProgressTracker();
    this.raftLog = new RaftLog();
    
    // 初始化进度跟踪器
    storage.peers.forEach(peer => {
      this.trk.progress[peer] = new Progress();
    });
  }
  
  becomeCandidate() {
    // 实现候选人状态转换
  }
  
  becomeLeader() {
    // 实现领导者状态转换
  }
  
  step(msg: IMessage): void {
    if (msg.type === 'MsgProp') {
      this.handleProposal(msg);
    }
  }
  
  private handleProposal(msg: IMessage) {
    if (msg.entries) {
      this.raftLog.unstable.push(...msg.entries);
    }
  }
  
  advanceMessagesAfterAppend() {
    // 更新所有peer的match和next索引
    Object.keys(this.trk.progress).forEach(peerId => {
      const peer = parseInt(peerId);
      if (peer !== this.id) {
        const progress = this.trk.progress[peer];
        progress.match = this.raftLog.unstable.length;
        progress.next = progress.match + 1;
      }
    });
  }
}

export { Raft, MemoryStorage };