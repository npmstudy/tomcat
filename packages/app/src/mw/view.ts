import { Plugable } from '@tomrpc/core';
import views from 'koa-views';

export class View extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'serve';
    this.init.push(this.a());
  }
  a() {
    return views(this.config?.root, this.config);
  }
}
