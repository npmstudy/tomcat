import Demo from './demo';
import Fn from './fn';
import RpcServer from './server';

const rpc = new RpcServer({});

const fn = new Fn();
const demo = new Demo();

rpc.plugin(fn);
rpc.plugin(demo);

rpc.start(2091);
