import debug from 'debug';

import Plugable from './base';
import { mountMiddleware } from './core';
import { isArrowFunction, getHttpMethods } from './utils';
const log = debug('@tomrpc/core');

export default class Fn extends Plugable {
  // public name: string;

  constructor(cfg?: any) {
    super(cfg);

    this.prefix = '/api';
    // this.name = 'fn';

    const a = this.a();
    const b = this.b();
    // console.dir(a + '');
    // this.addInit(a);
    // this.addInit(b);

    const c = this.c();
    // this.addLoad(c);

    this.config['server']['fn'] = function (items) {
      if (!this.config['functions']) this.config['functions'] = [];
      if (Object.entries(items)) {
        for (const [name, fn] of Object.entries(items)) {
          if (isArrowFunction(fn)) {
            console.log(
              `this.rpcFunctions[${name}] is arrow function, please use ctx as param, not this`
            );
          }
          if (this.rpcFunctions[name]) {
            log(`add ${name}: ${fn}`);
            console.log(`this.rpcFunctions[${name}] exisit`);
          }

          this.rpcFunctions[name] = fn;
        }
      } else {
        this.config['functions'].push(items);
      }
    };
  }
  process() {
    return mountMiddleware(this.config['functions']);
  }

  pre() {
    return async (ctx, next) => {
      log('beforeOne');
      const key = ctx.path.replace('/', '').split('/').join('.');
      // this.config.beforeOne(ctx, key);

      const lastKey = key.split('.').pop();
      const httpMethods = getHttpMethods();

      const supportMethods = [];
      httpMethods.forEach(function (m) {
        if (lastKey.indexOf(m) != -1) {
          log(m);
          supportMethods.push(m);
          return m;
        }
      });
      // console.log(supportMethods);

      if (supportMethods.length === 0) {
        log('没有匹配到包含get/post等方法的函数');
        await next();
      } else if (ctx.method === supportMethods[0]) {
        log('匹配到包含get/post等方法的函数');
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

  a() {
    return async (ctx, next) => {
      console.dir('a ' + ctx.path);
      await next();
    };
  }
  b() {
    return async (ctx, next) => {
      console.dir('b ' + ctx.path);
      await next();
    };
  }

  c() {
    return async (ctx, next) => {
      console.dir('c ' + ctx.path);
      await next();
    };
  }
}
