class RaftNode {
    id: string;
    name: string;
    type: string;
    url: string; // 节点的地址 建立联系的需要
    state: string; // 节点的状态  leader follower candidate
    term: number; // 当前的任期 就是说选民也要知道当前的任期，避免旧总统给你发消息 你还认为是对的
}

// 1、怎么初始化的？建立起了联系并有心跳

class Raft {

    nodes: Array<RaftNode>;
    constructor() {
        this.nodes = [];
    }

    // 首先 需要让节点之间建立联系，然后才能进行选举
    // 节点之间建立联系，需要知道对方的地址，然后才能建立连接

    // raft有硬状态，当前的状态，比如leader、follower、candidate

    // 保持时时发起心跳
    // 检测心跳超时 -> 发起选举
    // 1、发起选举要确保不能同时发起选举，避免系统的复杂性
    // leader状态过期
    // 每个节点都有logs：
    // 1、logs可以被覆盖（因为接受旧的leader的写入），新leader的写入就可以覆盖旧leader的写入
    // 2、logs正常追加

    // 所以每次log写入的时候，除了logs本身，还需要记录当前的term，日志的索引、leader的id

}