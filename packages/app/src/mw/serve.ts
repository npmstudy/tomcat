import { Plugable } from '@tomrpc/core';
import serveMiddleware from 'koa-static';

export class Serve extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'serve';
    this.init.push(this.a());
  }
  a() {
    return serveMiddleware(this.config.opts.root, this.config.opts);
  }
}
