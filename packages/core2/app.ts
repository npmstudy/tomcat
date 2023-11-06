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

// rpc.plugin(fn);
// rpc.plugin(demo);

rpc.start(2091);
