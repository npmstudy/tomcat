import { Plugable } from '@tomrpc/core';
import serveMiddleware from 'koa-static';

export class Serve extends Plugable {
  constructor(cfg?) {
    super(cfg);

    console.dir(cfg);

    // this.prefix = '';
    this.name = 'serve';
    this.init.push(this.a());
  }
  a() {
    console.dir('serve');
    return serveMiddleware(this.config.root, this.config.opts);
  }
}
