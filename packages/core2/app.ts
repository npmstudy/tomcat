import Demo from './demo';
import Fn from './src/fn';
import RpcServer from './src/server';

const rpc = new RpcServer({});

const fn = new Fn();
const demo = new Demo();

rpc.plugin(fn);
rpc.plugin(demo);

rpc.start(2091);
