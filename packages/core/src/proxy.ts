import debug from 'debug';

import { Plugable, Strategy } from './plugin';
import { isArrowFunction, getHttpMethods } from './utils';
const log = debug('@tomrpc/core/fn');

const ProxyDefaultConfig = {
  proxy: {
    inject: 'before', //init | load | before | after
    before: [],
  },
};

export class Proxy extends Plugable implements Strategy {
  public inject;

  constructor(cfg?: any) {
    super(Object.assign(ProxyDefaultConfig, cfg));
    //this.app.use(this.compose([this.before(), this.mount(), this.default()]));
  }

  proxy() {
    return async (ctx, next) => {
      log('proxy default');
      await next();
      log('proxy default end');
    };
  }
}
