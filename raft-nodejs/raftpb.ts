class Entry {
  constructor(public data: Buffer) {}
}

class Message {
  constructor(public options: {
    from: number;
    to: number;
    type: string;
    entries?: Entry[];
  }) {}
}

export { Message, Entry };