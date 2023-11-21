import TestProxy from './proxy';
import { Fn, createServer, Plugable } from './src/index';
// import { RpcServer } from './src/server';

// const rpc = new RpcServer({});
const rpc = createServer({
  fn: {
    // prefix: '/apk2',
  },
});

const tp = new TestProxy({});

rpc.plugin(tp);

console.dir(rpc);

rpc.fn('/a', function (a) {
  return { a: a };
});

rpc.add({
  c: (a: string) => {
    return a;
  },
  a: function (a: string, b: string) {
    return `${this.path} , ${a} c2 ${b}`;
  },
});
// rpc.plugin(fn);
// rpc.plugin(demo);

rpc.start(2091);
