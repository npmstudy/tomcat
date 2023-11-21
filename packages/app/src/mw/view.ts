import { Proxy } from '@tomrpc/core';
import views from 'koa-views';

export class View extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'init';
    // this.config.proxy.before = ['fn'];
  }
  proxy() {
    return views(this.config?.root, this.config);
  }
}
