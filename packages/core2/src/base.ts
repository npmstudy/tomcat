import Koa from 'koa';
import compose from 'koa-compose';

/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
export interface Strategy {
  init: any[];
  load: any[];
  prefix;
  name;
  app;
  compose;
  proxy;
  config;
  server;
  serverConfig;
}

export default class Plugable implements Strategy {
  public init: any[] = [];
  public load: any[] = [];
  public name;
  public app;
  public server;
  public serverConfig;
  public prefix;
  public compose;
  public config;

  constructor(cfg?) {
    this.config = Object.assign(
      {
        bind: {},
      },
      cfg
    );
    this.name = 'base';
    this.app = new Koa();
    this.init = [];
    this.load = [];
    this.compose = compose;

    // TODO: 此处最好改成mount
    this.load.push(this.getMiddleware());
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
    console.dir('getMiddleware');
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
