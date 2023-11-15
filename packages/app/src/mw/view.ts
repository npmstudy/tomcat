import { Plugable } from '@tomrpc/core';
import views from 'koa-views';

export class View extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'view';
    this.init.push(this.a());
  }
  a() {
    console.dir('register View');
    return views(this.config?.root, this.config);
  }
}
