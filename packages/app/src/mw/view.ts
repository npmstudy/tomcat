import views from 'koa-views';

export const view = {
  name: 'view',
  lifeCycle: 'load',
  mw: (cfg) => {
    // console.dir(opts);
    return views(cfg.root, cfg.opts);
  },
};
