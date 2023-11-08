import corsMiddleware from '@koa/cors';
import { Plugable } from '@tomrpc/core';

import { init } from '../init';

export const cors = {
  name: 'cors',
  lifeCycle: 'load',
  mw: (cfg = { opts: {} }) => {
    // console.dir(opts);
    return corsMiddleware(cfg.opts);
  },
};

export class Cors extends Plugable {
  constructor(cfg?) {
    super(cfg);

    this.prefix = '';
    this.name = 'cors';
    this.init.push(this.a());
  }
  a() {
    return corsMiddleware(this.config.opts);
  }
}
