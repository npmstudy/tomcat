import corsMiddleware from '@koa/cors';
import { Proxy } from '@tomrpc/core';

export class Cors extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'before';
    this.config.proxy.before = ['fn'];
  }
  proxy() {
    return corsMiddleware(this.config);
  }
}
