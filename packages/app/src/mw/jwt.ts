import koajwt from 'koa-jwt';

export const jwt = {
  name: 'jwt',
  lifeCycle: 'load',
  mw: (opts) => {
    // console.dir(opts);
    return koajwt(opts).unless({ path: opts.unless });
  },
};
