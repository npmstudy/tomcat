import debug from 'debug';

import { Plugable } from './plugin';
import { mergeDeep, isArrowFunction, getHttpMethods } from './utils';
const log = debug('@tomrpc/core/fn');

export interface IFnConfig {
  name?: string;
  prefix?: string;
}

export class Fn extends Plugable {
  constructor(cfg?: IFnConfig) {
    super(
      mergeDeep(
        {
          prefix: '/api',
          functions: [],
        },
        cfg
      )
    );

    this.name = 'Fn';
    this.prefix = this.config.prefix;

    this.app.use(this.compose([this.before(), this.mount(), this.default()]));
  }
  fn(key, fn) {
    // console.dir('=this.config=');
    // console.dir('fn=' + key);
    if (!this.config['functions']) this.config['functions'] = {};
    const pre = key.split('')[0] == '/' ? '' : '/';
    this.config['functions'][pre + key] = fn;
  }
  add(items) {
    for (const [name, fn] of Object.entries(items)) {
      if (isArrowFunction(fn)) {
        console.log(
          `this.rpcFunctions[${name}] is arrow function, please use ctx as param, not this`
        );
      }
      if (this.config['functions'][name]) {
        log(`add ${name}: ${fn}`);
        console.log(`this.rpcFunctions[${name}] exisit`);
      }
      this.fn(name, fn);
    }
  }

  default() {
    return async (ctx) => {
      log('default');
      ctx.body = '[fn plugin] no fn repsonse, please check your fn if exist';
      log('default end');
    };
  }

  mount() {
    return async (ctx, next) => {
      log(this);
      const routers = this.config['functions'];
      log(routers);

      const path = ctx.path; //.replace(prefix, '');
      log('mountMiddleware' + ctx.path);
      const key = '/' + path.replace('/', '').split('/').join('.');

      if (!['POST', 'PUT', 'PATCH'].includes(ctx.method) && !ctx.query.$p) {
        console.log('not match $p param, no process');
        ctx.body = 'not match $p param, no process';
      } else {
        const param = ctx.method === 'POST' ? ctx.request.body : JSON.parse(ctx.query.$p);

        log(key);
        log(param);
        log(routers[key]);

        if (routers[key]) {
          const args = [...param, ctx];
          console.dir(`call fn ${ctx.path}, with [${param}]`);
          const result = routers[key].apply(ctx, args);
          // console.dir(result);
          ctx.body = result;
        } else {
          const msg = JSON.stringify(ctx, null, 4);
          ctx.body = ` not match path ${ctx.path}  \n ctx = ${msg}`;
          await next();
        }
        //
      }
    };
  }
  before() {
    return async (ctx, next) => {
      log('before');
      const key = ctx.path.replace('/', '').split('/').join('.');

      const lastKey = key.split('.').pop();
      const httpMethods = getHttpMethods();
      // console.dir('lastKey');
      // console.dir(lastKey);

      const supportMethods = [];
      httpMethods.forEach(function (m) {
        if (lastKey.indexOf(m) != -1) {
          log(m);
          supportMethods.push(m);
          return m;
        }
      });

      // console.dir('supportMethods');
      // console.dir(ctx.method);
      // console.dir(supportMethods);

      if (supportMethods.length === 0) {
        log(ctx.path + ',没有匹配到包含get/post等开头的函数');
        await next();
      } else if (ctx.method.toLowerCase() === supportMethods[0]) {
        console.log('匹配到包含get/post等方法的函数');
        await next();
      } else {
        log('匹配到包含get/post等方法的函数，但method不对');
        ctx.body =
          'process fn:' +
          lastKey +
          ' , you need send ' +
          supportMethods[0] +
          ' request from client';
      }
      log('beforeOne end');
    };
  }
}
