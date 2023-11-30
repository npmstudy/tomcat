import { bodyParser } from '@koa/bodyparser';
import Koa, { Middleware } from 'koa';
import Application from 'koa';
import compose from 'koa-compose';
import mount from 'koa-mount';

import { Strategy, log } from './index';
import { mergeDeep } from './utils';

export const LifeCycleConfig = {
  hooks: {
    init: [], // 后面需要改成Set，否则会出现重复问题
    before: [],
    load: [],
    after: [],
    default: async (ctx, next) => {
      log('default');
      ctx.body = '[core server] no middleware repsonse, please check your route';
      log('default end');
    },
  },

  before: async (server: RpcServer) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.before;
    loadMiddlewares.forEach((mw: Middleware) => {
      app.use(mw);
    });
  },
  init: async (server: RpcServer) => {
    log('init');
    // console.dir(server);
    const app = server.app;
    const loadMiddlewares = server.config.hooks.init;
    loadMiddlewares.forEach((mw: Middleware) => {
      // console.dir(mw);
      app.use(mw);
    });
  },
  load: async (server: RpcServer) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.load;
    loadMiddlewares.forEach((mw: Middleware) => {
      app.use(mw);
    });
  },
  after: async (server: RpcServer) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.after;
    loadMiddlewares.forEach((mw: Middleware) => {
      app.use(mw);
    });
  },
};

export interface IRpcServerConfig {
  name?: string | 'tomapp';
  hooks?: {
    init: Array<Middleware>;
    before: Array<Middleware>;
    load: Array<Middleware>;
    after: Array<Middleware>;
    default(): Promise<Middleware>;
  };
  before?(server: RpcServer): Promise<void>;
  init?(server: RpcServer): Promise<void>;
  load?(server: RpcServer): Promise<void>;
  after?(server: RpcServer): Promise<void>;
}
/**
 * @type {RpcServer} The Server maintains a server to bind one of the Strategy
 * objects. The Server does not know the concrete class of a strategy. It
 * should work with all strategies via the Strategy interface.
 */
export class RpcServer {
  private plugins: Strategy[] = [];
  app: Application;
  use;
  proxy = {
    init: [],
    load: [],
    before: {},
  };
  config;
  init: [];
  load: [];
  /**
   * Usually, the Server accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(cfg?: IRpcServerConfig) {
    // init
    this.config = mergeDeep(LifeCycleConfig, cfg);
    this.app = new Koa();
    this.app.use(bodyParser());
    this.use = this.app.use;
  }

  /**
   * Usually, the Server allows replacing a Strategy object at runtime.
   */
  public plugin(strategy: Strategy): void {
    this.plugins.push(strategy);
  }

  public mount(): void {
    log('mount');
    const cfg = {};
    // setting
    for (const plugin of this.plugins) {
      plugin.server = this;
      plugin.serverConfig = this.config;

      // set config namespace
      if (plugin.name === 'base') {
        log('plugin name 没有修改，可能会出现serverConfig获取问题，请关注');
      }

      this.config[plugin.name] = plugin.config;
      cfg[plugin.name] = plugin;
    }

    // this.app.use(async (ctx, next) => {
    //   for (const fn in cfg) {
    //     // console.log('--' + fn);
    //     ctx[fn] = cfg[fn];
    //   }

    //   await next();
    // });

    // proxy
    for (const plugin of this.plugins) {
      if (plugin.config.proxy) {
        if (plugin.config.proxy.inject === 'init') {
          log('plugin.config.proxy.inject init');
          this.proxy.init.push(plugin.proxy());
        }
        if (plugin.config.proxy.inject === 'load') {
          log('plugin.config.proxy.inject load');
          this.proxy.load.push(plugin.proxy());
        }
        if (plugin.config.proxy.inject === 'before') {
          log('plugin.config.proxy.inject before');
          for (const i in plugin.config.proxy.before) {
            const name = plugin.config.proxy.before[i];
            if (!this.proxy.before[name.toLowerCase()]) this.proxy.before[name.toLowerCase()] = [];
            this.proxy.before[name.toLowerCase()].push(plugin.proxy());
          }
        }
      }
    }

    // init
    this.config.hooks.init = this.proxy.init;
    for (const plugin of this.plugins) {
      log('init stage');
      if (plugin.init.length > 0) this.config.hooks.init.push(...plugin.init);
    }

    // use inits middleware
    this.config.init(this);

    // load
    this.config.hooks.load = this.proxy.load;
    for (const plugin of this.plugins) {
      log('load stage');
      if (plugin.load.length > 0) this.config.hooks.load.push(...plugin.load);
    }

    // use loads middleware
    this.config.load(this);

    // mount app
    for (const plugin of this.plugins) {
      log('mount plugin ' + plugin.prefix);

      const mw = this.proxy.before[plugin.name.toLowerCase()] || [];

      const app = plugin.prefix === '' ? mount(plugin.app) : mount(plugin.prefix, plugin.app);
      // log(plugin.config.prefix);
      this.app.use(compose([...mw, app]));
    }

    // 兜底的else
    log('兜底的else');
    this.app.use(this.config.hooks.default);
  }

  /**
   * make app ready, add before hook & mount & after hook
   */
  private prepare() {
    log('prepare');

    // before
    this.config.before(this);

    // mount plugin with strategy
    this.mount();

    // after
    this.config.after(this);

    // never see it
    this.app.use(function (ctx: Koa.BaseContext) {
      ctx.body = 'default';
    });
  }

  public callback() {
    log('callback');
    this.prepare();

    return this.app.callback();
  }

  /**
   * Start @tomrpc/core server with port
   */
  /* v8 ignore next 3 */
  public start(port?: number) {
    log('start');
    // make app ready
    this.prepare();

    const _port = port || 3000;
    return this.app.listen(_port, (): void => {
      console.log('@tomrpc/core listening on ' + _port);
    });
  }
}
