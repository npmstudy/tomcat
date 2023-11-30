import debug from 'debug';
import Koa from 'koa';
import compose from 'koa-compose';

import { mergeDeep } from './utils';

const log = debug('@tomrpc/core/plugin');
/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Server uses this interface to call the algorithm defined by Concrete
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
    this.config = mergeDeep(
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

    // load can before mount
    this.load.push(this.getMiddleware());
  }

  /**
   * move middleware to load stage, use template pattern & compose
   */
  getMiddleware() {
    log('getMiddleware');
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
