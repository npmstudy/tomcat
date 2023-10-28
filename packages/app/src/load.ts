import debug from 'debug';

const log = debug('@tomrpc/app');

export async function loadCustomMiddlewaire(rpc?, m?) {
  loadMiddleware(rpc, 'load', m);
}
export async function loadInitMiddleware(rpc?, m?) {
  // console.dir(m);
  loadMiddleware(rpc, 'init', m);
}

export async function loadBuildinMiddlewaire(rpc?) {
  const buildin = rpc.config.buildin;
  log(rpc.config);
  log(buildin);
  const mw = await import('./mw');
  for (const key in buildin) {
    const m = buildin[key];
    log(m);
    if (m['enable'] === true) {
      log(buildin[key]);
      const _m = mw[key];
      log(_m);
      log(_m.lifeCycle);
      loadMiddleware(rpc, _m.lifeCycle, _m.mw(m));
    }
  }
}

export async function loadMiddleware(rpc, lifeCycle, mw) {
  console.dir(lifeCycle);
  console.dir(mw);
  rpc.config.hooks[lifeCycle].push(mw);
}
