import * as mw from './mw';

export async function loadCustomMiddlewaire(rpc?, m?) {
  loadMiddleware(rpc, 'load', m);
}

export async function loadBuildinMiddlewaire(rpc?) {
  const buildin = rpc.config.buildin;
  for (const key in buildin) {
    Object.keys(mw).forEach(function (i) {
      console.dir(mw[i]);
      const m = mw[i];

      if (key['enable'] && key === i) loadMiddleware(rpc, m.lifeCycle, m);
    });
  }
}

export async function loadMiddleware(rpc, lifeCycle, mw) {
  rpc.hooks[lifeCycle].push(mw);
}
