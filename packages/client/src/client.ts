import debug from 'debug';
import fetch from 'isomorphic-unfetch';

const log = debug('@tomrpc/client');

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
    log(config);
    // ...
    this.config = config;
    if (config.host) this.host = config.host;
    if (config.port) this.port = config.port;
  }

  async get(key: string, ...r: unknown[]) {
    // console.dir('client get request');
    // console.dir(key);
    // ...
    const path = key.split('.').join('/');
    const url = `http://${this.host}:${this.port}/${path}?$p=${JSON.stringify(r)}`;

    log(url);
    const response = await fetch(url);
    const data = await response.text();
    log(data);
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