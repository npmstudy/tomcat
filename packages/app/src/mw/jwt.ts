import { Plugable } from '@tomrpc/core';
import koajwt from 'koa-jwt';

export class Jwt extends Plugable {
  constructor(cfg?) {
    super(cfg);
    // console.dir(this.config);

    this.prefix = '';
    this.name = 'jwt';
    this.init.push(this.a());
  }
  a() {
    console.dir('register jwt');
    return koajwt(this.config).unless({ path: this.config.unless });
  }
}
