import debug from 'debug';

const log = debug('@tomrpc/client');

import { TomClient } from '.';

export const defaultConfig = {
  methodFilter: function (lastKey: string) {
    if (lastKey) return 'get';
  },
  invoke: async function (config, key, parms) {
    // console.dir(config);
    const o = new TomClient(config);
    const lastKey = key.split('.').pop();
    const method = config.methodFilter(lastKey).toLowerCase();
    log(lastKey);
    log(method);
    const _p = [key, ...parms];
    return await o[method](..._p);
  },
};

/**
 *
 *
const proxy = createClient();
const proxy2 = createClient({ namespace: 'abc.xxx' });

console.log(proxy);
console.log(proxy2);
console.log(proxy.add(2, 3));
console.log(proxy2.abc(1, 3));

 * @param
 * @param config
 * @returns
 */

export function createClient(config?: any): any {
  const _cfg = Object.assign(defaultConfig, config);
  const target = {};
  let clientProxy = { x: '', config: {} };
  const o = [];
  const t = [];
  const fn = (item) => {
    log('item = ' + item);
    t.push(item);
    o.push(o.length === 0 ? target : (o[o.length - 1][item] = {}));
    clientProxy = new Proxy(o[o.length - 1], {
      get: function (target: any, prop: string) {
        return async function (...args) {
          log(' - - - ');
          log(target.x + '.' + prop);
          log(args);
          const key = target.x ? target.x + '.' + prop : prop;
          return await _cfg.invoke(_cfg, key, args);
        };
      },
    });
    clientProxy.x = t.join('.').replace('default.', '');
    clientProxy.config = _cfg;
  };

  // 默认
  fn('default');

  // 如果有a.b.c
  // 依次a、a.b、a.b.c创建代理
  config?.namespace?.split('.').forEach(fn);

  return clientProxy;
}
