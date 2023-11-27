import { bodyParser } from '@koa/bodyparser';
import Koa from 'koa';
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

  before: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.before;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  init: async (server) => {
    console.dir('init');
    // console.dir(server);
    const app = server.app;
    const loadMiddlewares = server.config.hooks.init;
    loadMiddlewares.forEach((mw) => {
      console.dir(mw);
      app.use(mw);
    });
  },
  load: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.load;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  after: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.after;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
};

export class RpcServer {
  /**
   * @type {Strategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private plugins: Strategy[] = [];
  app;
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
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(cfg) {
    // init
    this.config = mergeDeep(LifeCycleConfig, cfg);
    this.app = new Koa();
    this.app.use(bodyParser());
    this.use = this.app.use;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public plugin(strategy: Strategy) {
    this.plugins.push(strategy);
  }

  public mount() {
    // console.dir('mount');

    const cfg = {};
    // setting
    for (const plugin of this.plugins) {
      plugin.server = this;
      plugin.serverConfig = this.config;

      // set config namespace
      if (plugin.name === 'base') {
        console.error('plugin name 没有修改，可能会出现serverConfig获取问题，请关注');
      }
      // console.log('mount plugin.config');
      // console.log(plugin);
      // console.log(plugin.config);
      // console.log(plugin.config.bind);
      for (const bindnName in plugin.config.bind) {
        // console.dir(bindnName);
        // this[bindnName] = plugin.config['bind'][bindnName];
      }

      this.config[plugin.name] = plugin.config;
      cfg[plugin.name] = plugin;
    }

    this.app.use(async (ctx, next) => {
      // ;
      for (const fn in cfg) {
        // console.log('--' + fn);
        ctx[fn] = cfg[fn];
      }

      await next();
    });

    // proxy
    for (const plugin of this.plugins) {
      console.dir('init proxy stage');
      // console.dir(plugin);

      if (plugin.config.proxy) {
        if (plugin.config.proxy.inject === 'init') {
          console.dir('plugin.config.proxy.inject init');
          this.proxy.init.push(plugin.proxy());
        }
        if (plugin.config.proxy.inject === 'load') {
          console.dir('plugin.config.proxy.inject load');
          this.proxy.load.push(plugin.proxy());
        }
        if (plugin.config.proxy.inject === 'before') {
          console.dir('plugin.config.proxy.inject before');
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
      console.dir('init stage');
      if (plugin.init.length > 0) this.config.hooks.init.push(...plugin.init);

      // console.dir(this.config.hooks.init);
    }

    // use inits middleware
    this.config.init(this);

    // load
    this.config.hooks.load = this.proxy.load;
    for (const plugin of this.plugins) {
      console.dir('load stage');
      if (plugin.load.length > 0) this.config.hooks.load.push(...plugin.load);
      // console.dir('load plugin');
      // console.dir(plugin.load);
      // console.dir('load end plugin');
      // console.dir(this.config.hooks.init);
    }

    // use loads middleware
    this.config.load(this);

    // mount app
    for (const plugin of this.plugins) {
      console.dir('mount plugin ' + plugin.prefix);

      const mw = this.proxy.before[plugin.name.toLowerCase()] || [];

      const app = plugin.prefix === '' ? mount(plugin.app) : mount(plugin.prefix, plugin.app);
      console.dir(plugin.prefix);
      this.app.use(compose([...mw, app]));

      // console.dir(plugin.prefix === '');
      // console.dir(mw);
    }

    // 兜底的else
    console.dir('兜底的else');
    this.app.use(this.config.hooks.default);
    // this.app.use(async (ctx, next) => {
    //   console.dir(ctx.path);
    //   ctx.body = { 23: 23 };
    // });
  }

  /**
   * The Context delegates some work to the Strategy object instead of
   * implementing multiple versions of the algorithm on its own.
   */
  public start(port?: number): void {
    const _port = port || 3000;
    // console.dir(_port);

    this.config.before(this);

    this.mount();

    this.config.after(this);

    this.app.use(function (ctx, next) {
      ctx.body = 'default';
    });

    this.app.listen(_port, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('@tomrpc/core listening on ' + _port);
      }
    });
  }
}
