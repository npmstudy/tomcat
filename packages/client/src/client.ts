import debug from 'debug';
import fetch from 'isomorphic-unfetch';
const log = debug('@tomrpc/client');

/**
 *
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#response_objects
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
  private prefix = '/api';
  constructor(config) {
    log(config);
    // ...
    this.config = config;
    if (config.host) this.host = config.host;
    if (config.port) this.port = config.port;
    if (config.prefix) this.prefix = config.prefix;
  }

  async get(key: string, ...r: unknown[]) {
    log('client get request');

    const path = key.split('.').join('/');
    const url = `http://${this.host}:${this.port}${this.prefix}/${path}?$p=${JSON.stringify(r)}`;

    log(url);

    const response = await fetch(url);

    return response;
  }

  async post(key: string, ...r: unknown[]) {
    log('client post request');

    const path = key.split('.').join('/');

    const url = `http://${this.host}:${this.port}${this.prefix}/${path}`;

    log(url);
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(r),
      headers: { 'Content-Type': 'application/json' },
    });

    return response;
  }
}
