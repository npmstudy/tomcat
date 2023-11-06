import Demo from './demo';
import { Fn, createServer } from './src/index';
// import { RpcServer } from './src/server';

// const rpc = new RpcServer({});
const rpc = createServer({});

const fn = new Fn({});
const demo = new Demo({});

rpc['fn']('/a', function (a) {
  return { a: a };
});

rpc['add']({
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
