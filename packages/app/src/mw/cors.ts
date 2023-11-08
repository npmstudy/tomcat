import corsMiddleware from '@koa/cors';
import { Plugable } from '@tomrpc/core';

export class Cors extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'cors';
    this.init.push(this.a());
  }
  a() {
    return corsMiddleware(this.config.opts);
  }
}
