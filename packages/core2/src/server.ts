import { bodyParser } from '@koa/bodyparser';
import debug from 'debug';
import Koa from 'koa';
const log = debug('@tomrpc/core2');
import mount from 'koa-mount';

import { Strategy } from './plugin';

export const LifeCycleConfig = {
  hooks: {
    init: [],
    before: [],
    load: [],
    beforeMount: [],
    afterMount: [],
    after: [],
    default: async (ctx, next) => {
      log('default');
      ctx.body = 'no middleware repsonse, please check your route';
      log('default end');
    },
  },
  init: async (server) => {
    console.dir('init');
    // console.dir(server);
    const app = server.app;
    const loadMiddlewares = server.config.hooks.init;
    loadMiddlewares.forEach((mw) => {
      app.use(mw);
    });
  },
  before: async (server) => {
    const app = server.app;
    const loadMiddlewares = server.config.hooks.before;
    loadMiddlewares.forEach((mw) => {
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
  beforeAll: async (ctx, next) => {
    log('beforeAll');
    await next();
    log('beforeAll end');
  },
  beforeEach: async (ctx, next) => {
    log('beforeEach');
    await next();
    log('beforeEach end');
  },
  afterEach: async (ctx, next) => {
    log('afterEach');
    await next();
    log('afterEach end');
  },
  afterAll: async (ctx, next) => {
    log('afterAll');
    await next();
    log('afterAll end');
  },
  beforeOne: function (ctx, key: string) {
    log('beforeOne key=' + key);
  },
  afterOne: function (ctx, key: string) {
    log('afterOne key=' + key);
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
  config;
  init: [];
  load: [];
  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(cfg) {
    // init
    this.config = Object.assign(LifeCycleConfig, cfg);
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
    console.dir('mount');

    const cfg = {};
    // setting
    for (const plugin of this.plugins) {
      plugin.server = this;
      plugin.serverConfig = this.config;

      // set config namespace
      if (plugin.name !== 'base') {
        console.error('plugin name 没有修改，可能会出现serverConfig获取问题，请关注');
      }
      console.log('mount plugin.config');
      // console.log(plugin);
      // console.log(plugin.config);
      // console.log(plugin.config.bind);
      for (const bindnName in plugin.config.bind) {
        console.dir(bindnName);
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

    // hooks
    for (const plugin of this.plugins) {
      console.dir('init stage');
      if (plugin.init.length > 0) this.config.hooks.init.push(...plugin.init);

      // console.dir(this.config.hooks.init);
    }

    this.config.init(this);

    for (const plugin of this.plugins) {
      console.dir('load stage');
      if (plugin.load.length > 0) this.config.hooks.load.push(...plugin.load);
      // console.dir('load plugin');
      // console.dir(plugin.load);
      // console.dir('load end plugin');
      // console.dir(this.config.hooks.init);
    }

    console.dir('load');
    this.config.load(this);

    // mount app
    for (const plugin of this.plugins) {
      console.dir('mount plugin ' + plugin.prefix);
      // console.dir(plugin);
      // this.app.use(compose([plugin.proxy(), mount(plugin.prefix, plugin.app)]));
      this.app.use(mount(plugin.prefix, plugin.app));
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
    console.dir(_port);

    this.config.before(this);

    // this.config.beforeMount(this);
    this.mount();

    // this.config.afterMount(this);
    this.config.after(this);
    // this.app.use(this.config.afterAll);

    this.app.listen(_port, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Koa app listening on ' + _port);
      }
    });
  }
}
