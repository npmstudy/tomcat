import debug from 'debug';
import compose from 'koa-compose';

import { Fn } from './fn';
import { RpcServer } from './server';
import { mergeDeep } from './utils';

export * from './plugin';
export * from './proxy';
export * from './fn';
export * from './server';
export * from './utils';

const log = debug('@tomrpc/core/index');
export const combine = compose;

interface IConfig {
  name: string | 'tomapp';
  base?: string;
  port?: number | 3000;
  debug?: boolean | false;
  mount?: string;
  buildin: {
    // serve?: IServe;
    // cors?: ICors;
    // view?: IView;
    // jwt?: IJwt;
  };
}
export function createServer(cfg?: any) {
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
