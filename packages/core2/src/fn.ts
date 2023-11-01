import debug from 'debug';

import Plugable from './base';
import { mountMiddleware } from './core';
import { isArrowFunction, getHttpMethods } from './utils';
const log = debug('@tomrpc/core');

export default class Fn extends Plugable {
  // public name: string;

  constructor(cfg?: any) {
    super(cfg);

    this.name = 'Fn';
    this.prefix = '/api';
  }
  fn(key, fn) {
    console.dir('=this.config=');
    console.dir(this.config);
    if (!this.config['functions']) this.config['functions'] = {};
    this.config['functions'][key] = fn;
    // if (Object.entries(items)) {
    //   // for (const [name, fn] of Object.entries(items)) {
    //   //   if (isArrowFunction(fn)) {
    //   //     console.log(
    //   //       `this.rpcFunctions[${name}] is arrow function, please use ctx as param, not this`
    //   //     );
    //   //   }
    //   //   if (this.rpcFunctions[name]) {
    //   //     log(`add ${name}: ${fn}`);
    //   //     console.log(`this.rpcFunctions[${name}] exisit`);
    //   //   }
    //   //   this.rpcFunctions[name] = fn;
    //   // }
    // } else {
    //   this.config['functions'].push(items);
    // }
  }

  process() {
    console.dir("this.config['functions']");
    console.dir(this);
    console.dir(this.serverConfig);
    return mountMiddleware(this);
  }

  pre() {
    return async (ctx, next) => {
      console.log('beforeOne');
      const key = ctx.path.replace('/', '').split('/').join('.');
      // this.config.beforeOne(ctx, key);

      const lastKey = key.split('.').pop();
      const httpMethods = getHttpMethods();

      const supportMethods = [];
      httpMethods.forEach(function (m) {
        if (lastKey.indexOf(m) != -1) {
          console.log(m);
          supportMethods.push(m);
          return m;
        }
      });
      // console.log(supportMethods);

      if (supportMethods.length === 0) {
        console.log('没有匹配到包含get/post等方法的函数');
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
}
