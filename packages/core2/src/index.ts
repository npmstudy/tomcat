import { Fn } from './fn';
import { RpcServer } from './server';
export * from './plugin';
export * from './fn';
export * from './server';
export * from './utils';

export function createServer(cfg?: any) {
  const rpc = new RpcServer(Object.assign({ fn: {} }, cfg));

  const fn = new Fn(Object.assign({}, cfg.fn));

  rpc['fn'] = function (key, fun) {
    fn.fn(key, fun);
  };
  rpc['add'] = function (items) {
    fn.add(items);
  };

  rpc.plugin(fn);

  return rpc;
}
