import corsMiddleware from '@koa/cors';

export const cors = {
  name: 'cors',
  lifeCycle: 'load',
  mw: (opts = {}) => {
    // console.dir(opts);
    return corsMiddleware(opts);
  },
};
