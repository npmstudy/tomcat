import debug from 'debug';
import Koa from 'koa';
import compose from 'koa-compose';

const log = debug('@tomrpc/core/plugin');
/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
export declare interface Strategy {
  init: any[];
  load: any[];
  prefix;
  name;
  app;
  compose;
  server;
  serverConfig;
  config: any;
  proxy?(): any;
}

export class Plugable implements Strategy {
  public init: any[] = [];
  public load: any[] = [];
  public name;
  public app;
  public server;
  public serverConfig;
  public prefix;
  public compose;
  public config: any;

  public _prefix;

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
    this.prefix = this.config.prefix ? this.config.prefix : '';

    this.compose = compose;

    // TODO: 此处最好改成mount
    this.load.push(this.getMiddleware());
  }

  getConfig(ctx) {
    return ctx[this.name];
  }

  getMiddleware() {
    // console.dir('getMiddleware');
    const pre = this.pre();
    const process = this.process();
    const post = this.post();
    return compose([pre, process, post]);
  }

  pre() {
    return async (ctx, next) => {
      log('pre');
      await next();
      log('pre end');
    };
  }
  post() {
    return async (ctx, next) => {
      log('after');
      await next();
      log('after end');
    };
  }
  process() {
    return async (ctx, next) => {
      log('process default');
      await next();
      log('process default end');
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
