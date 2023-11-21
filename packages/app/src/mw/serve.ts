import { Proxy } from '@tomrpc/core';
import serveMiddleware from 'koa-static';

export class Serve extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'init';
    // this.config.proxy.before = ['fn'];
  }
  proxy() {
    return serveMiddleware(this.config.root, this.config.opts);
  }
}
