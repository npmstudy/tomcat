import serveMiddleware from 'koa-static';

export const Serve = {
  name: 'serve',
  lifeCycle: 'load',
  mw: (opts) => {
    // console.dir(opts);
    return serveMiddleware(opts.root, opts);
  },
};
