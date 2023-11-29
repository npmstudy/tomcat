import debug from 'debug';
import Koa from 'koa';

import { Plugable } from './plugin';
import { mergeDeep } from './utils';

const log = debug('@tomrpc/core/fn');

const ProxyDefaultConfig = {
  proxy: {
    inject: 'before', //init | load | before | after
    before: [],
  },
};

export interface IProxyConfig {
  name?: string | 'tomapp';
  proxy?: {
    inject: 'init' | 'load' | 'before' | 'after';
    before: [];
  };
}

export class Proxy extends Plugable {
  public inject;

  constructor(cfg?: IProxyConfig) {
    super(mergeDeep(ProxyDefaultConfig, cfg));
  }

  proxy() {
    return async (ctx: Koa.BaseContext, next) => {
      log('proxy default');
      await next();
      log('proxy default end');
    };
  }
}
