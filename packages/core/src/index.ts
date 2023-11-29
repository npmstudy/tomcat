import debug from 'debug';
import compose from 'koa-compose';

import { Fn, IFnConfig } from './fn';
import { RpcServer, IRpcServerConfig } from './server';
import { mergeDeep } from './utils';

export * from './plugin';
export * from './proxy';
export * from './fn';
export * from './server';
export * from './utils';

const log = debug('@tomrpc/core/index');
export const combine = compose;

interface IServerConfig {
  base?: string;
  fn?: IFnConfig;
}

type IIndexServerConfig = IRpcServerConfig & IServerConfig;

export function createServer(cfg?: IIndexServerConfig) {
  const rpc = new RpcServer(mergeDeep({ fn: {} }, cfg));
  const fn = new Fn(mergeDeep({}, cfg.fn));
  rpc.plugin(fn);

  return mergeDeep(rpc, {
    base: '.',
    init: rpc['config']['hooks']['init'],
    before: rpc['config']['hooks']['before'],
    load: rpc['config']['hooks']['load'],
    after: rpc['config']['hooks']['after'],
    fn: function (key, fun) {
      log('use rpc.fn add fn =' + key);
      fn.fn(key, fun);
    },
    add: function (items) {
      log('use rpc.add add fn =' + items);
      fn.add(items);
    },
  });
}
