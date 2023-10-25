import fetch from 'isomorphic-unfetch';

export const lib = () => 'lib';

/**
 *
 *
http://127.0.0.1:3000/a?$p=[%22hello%22,%22world%22]

get('a', "hello","world")



 * @param key
 * @param param
 * @returns
 */

export class TomClient {
  private config;
  private host = '127.0.0.1';
  private port = '3000';
  constructor(config) {
    // ...
    this.config = config;
    if (config.host) this.host = config.host;
    if (config.port) this.port = config.port;
  }

  async get(key: string, ...r: unknown[]) {
    // ...
    const path = key.split('.').join('/');
    const response = await fetch(
      `http://${this.host}:${this.port}/${path}?$p=${JSON.stringify(r)}`
    );
    const data = await response.text();
    return data;
  }

  async post(key: string, ...r: unknown[]) {
    // ...
    const path = key.split('.').join('/');

    const response = await fetch(`http://${this.host}:${this.port}/${path}`, {
      method: 'post',
      body: JSON.stringify(r),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.text();
    return data;
  }
}

// export const createClient = async function (config) {

const handler = {
  get: async function (target, prop, receiver) {
    // console.dir(prop);
    return async function (...args) {
      console.dir(' - - - ');
      console.dir(target.config.namespace + '.' + prop);
      console.dir(args);
      const c = new TomClient(target.config);
      return c.get.apply(null, [target.namespace + '.' + prop, args]);
    };
  },
};

export async function createClient(config = { namespace: 'default' }) {
  const target = {};
  let p = { config: config };
  const o = [];
  const fn = (item) => {
    o.push(o.length === 0 ? target : (o[o.length - 1][item] = {}));
    p = new Proxy(o[o.length - 1], handler);
  };

  config?.namespace?.split('.').length === 0 && fn(config.namespace);
  config?.namespace?.split('.').forEach(fn);

  p.config.namespace =
    config.namespace && config.namespace.split('.') && config.namespace.split('.').pop();
  p.config = config;
  return p;
}

// const proxy = createClient();
const proxy2 = createClient('abc.add');

// console.log(proxy.add(2, 3));
console.log(proxy2.abc(1, 3));
