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

export const createClient = async function (config) {
  const client = new TomClient(config);
  const userProxy = new Proxy(client, {
    get: (target: any, prop: any) => {
      // create default values for non-existent properties
      if (!(prop in target)) {
        return `[${prop} not set]`;
      }
      return target[prop];
    },
    apply: (target: any, thisArg: any, args: any) => {
      // client.get('a', 'hello', 'world');
      console.log(`Called method "${target.name}" with args:`, args);
      return target.get(target.name, thisArg, args);
    },
  });
  // const userProxy = new Proxy(client, {

  //   get: (target: any, prop: any) => {
  //     // intercept property access
  //     console.log(`Getting property "${prop}"`);
  //     target.name1 = function () {
  //       return 2;
  //     };
  //     if (target[prop]) {
  //       return target[prop];
  //     } else {
  //       // client.get('a', 'hello', 'world');
  //       client.get;
  //     }
  //   },
  // });

  // console.dir(userProxy.name1());
  return userProxy;
};
