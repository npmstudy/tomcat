import { Plugable } from '@tomrpc/core';
import koajwt from 'koa-jwt';

export class Jwt extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'jwt';
    // this.init.push(this.a());
  }
  // a() {
  //   return return koajwt(this.config.opts).unless({ path: this.config.opts.unless });
  // }
}
