export async function loadCustomMiddlewaire(rpc?, m?) {
  loadMiddleware(rpc, 'load', m);
}

export async function loadBuildinMiddlewaire(rpc?) {
  const buildin = rpc.config.buildin;
  // console.dir(rpc.config);
  // console.dir(buildin);
  const mw = await import('./mw');
  for (const key in buildin) {
    const m = buildin[key];
    console.dir(m);
    if (m['enable'] === true) {
      // console.dir(buildin[key]);
      const _m = mw[key];
      console.dir(_m);
      console.dir(_m.lifeCycle);
      loadMiddleware(rpc, _m.lifeCycle, _m.mw(m));
    }
  }
}

export async function loadMiddleware(rpc, lifeCycle, mw) {
  rpc.config.hooks[lifeCycle].push(mw);
}
