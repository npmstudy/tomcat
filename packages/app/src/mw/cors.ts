import corsMiddleware from '@koa/cors';
import { Plugable } from '@tomrpc/core';

export class Cors extends Plugable {
  constructor(cfg?) {
    super(cfg);
    console.dir(this.config);
    this.name = 'cors';
    this.init.push(this.a());
  }
  a() {
    console.dir('register Cors');
    return corsMiddleware(this.config);
  }
}
