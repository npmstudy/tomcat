import compose from 'koa-compose';

import { Fn } from './fn';
import { RpcServer } from './server';

export * from './plugin';
export * from './proxy';
export * from './fn';
export * from './server';
export * from './utils';

export const combine = compose;

export function createServer(cfg?: any) {
  const rpc = new RpcServer(Object.assign({ fn: {} }, cfg));

  const fn = new Fn(Object.assign({}, cfg.fn));
  console.dir('createServer');

  rpc.plugin(fn);

  return Object.assign(rpc, {
    base: '.',
    init: rpc['config']['hooks']['init'],
    before: rpc['config']['hooks']['before'],
    load: rpc['config']['hooks']['load'],
    after: rpc['config']['hooks']['after'],
    dump: function () {
      console.dir('dump');
    },
    fn: function (key, fun) {
      fn.fn(key, fun);
      // console.dir(fn);
    },
    add: function (items) {
      fn.add(items);
    },
  });
}
