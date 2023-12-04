import { Proxy } from '@tomrpc/core';
import koajwt from 'koa-jwt';

export class Jwt extends Proxy {
  constructor(cfg?) {
    super(cfg);

    this.config.proxy.inject = 'before';
    this.config.proxy.before = ['fn'];
  }
  // proxy() {
  //   // return koajwt(this.config).unless({ path: this.config.unless });
  // }
}
