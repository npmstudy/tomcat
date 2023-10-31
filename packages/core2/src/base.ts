import Koa from 'koa';
import compose from 'koa-compose';

import { Strategy } from '../server';

export default class Plugable implements Strategy {
  public init: any[] = [];
  public load: any[] = [];
  public name;
  public app;
  public prefix;
  public compose;

  constructor() {
    this.name = 'fn';
    this.app = new Koa();
    this.init = [];
    this.load = [];
    this.use(this.getMiddleware());
    this.compose = compose;
  }

  proxy() {
    return async (ctx, next) => {
      console.dir('proxy prefix=' + this.prefix);
      if (ctx.path.match(this.prefix)) {
        console.dir('proxy ' + ctx.path);
        await next();
        console.dir('proxy end ' + ctx.path);
      } else {
        console.dir('not proxy ' + ctx.path);
        await next();
        console.dir('not proxy end ' + ctx.path);
      }
    };
  }

  getMiddleware() {
    const pre = this.pre();
    const process = this.process();
    const after = this.after();
    return compose([pre, process, after]);
  }

  pre() {
    return async (ctx, next) => {
      console.dir('pre');
      await next();
      console.dir('pre end');
    };
  }
  after() {
    return async (ctx, next) => {
      console.dir('after');
      await next();
      console.dir('after end');
    };
  }
  process() {
    return async (ctx, next) => {
      console.dir('process default');
      await next();
      console.dir('process default end');
    };
  }

  use(x) {
    this.app.use(x);
  }

  addInit(i) {
    this.init.push(i);
  }

  addLoad(i) {
    this.load.push(i);
  }
}
