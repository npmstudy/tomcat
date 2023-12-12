import debug from 'debug';
import compose from 'koa-compose';

import { Fn, IFnConfig } from './fn';
import { BaseRpcServer, IRpcServerConfig } from './server';
import { mergeDeep } from './utils';

export * from './plugin';
export * from './proxy';
export * from './fn';
export * from './server';
export * from './utils';

const log = debug('@tomrpc/core/index');
export const combine = compose;

export interface IServerConfig {
  base?: string;
  fn?: IFnConfig;
}

export type IIndexServerConfig = IRpcServerConfig & IServerConfig;

export class RpcServer extends BaseRpcServer {
  private fnPlugin;
  public base;
  public before;
  public after;

  constructor(cfg?: IIndexServerConfig) {
    super(cfg);
    this.fnPlugin = new Fn(mergeDeep({}, cfg.fn));
    this.plugin(this.fnPlugin);

    this.base = '.';
    this.init = this['config']['hooks']['init'];
    this.before = this['config']['hooks']['before'];
    this.load = this['config']['hooks']['load'];
    this.after = this['config']['hooks']['after'];
  }

  public fn(key, fun) {
    log('use rpc.fn add fn =' + key);
    this.fnPlugin.fn(key, fun);
  }
  public add(items) {
    log('use rpc.add add fn =' + items);
    this.fnPlugin.add(items);
  }
}

export function createServer(cfg?: IIndexServerConfig) {
  return new RpcServer(mergeDeep({ fn: {} }, cfg));
}
