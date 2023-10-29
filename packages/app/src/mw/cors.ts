import corsMiddleware from '@koa/cors';

export const cors = {
  name: 'cors',
  lifeCycle: 'load',
  mw: (cfg = { opts: {} }) => {
    // console.dir(opts);
    return corsMiddleware(cfg.opts);
  },
};
