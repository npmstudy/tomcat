import { createServer } from '@tomrpc/core';
import mount from '@tomrpc/mount';
import debug from 'debug';

import { init } from './init';
import { loadBuildinMiddlewaire, loadInitMiddleware } from './load';
import { Serve, Cors, View } from './mw/index';

const log = debug('@tomrpc/app');

// {
//   name:'hi'
//   base: import.meta.url
//   static: 'public'
//   cors: { enable: true }
//   view: { enable: true }
//   jwt: { enable: true }
//   port: 3000
//   mount: './fn'
//   lifeCyle: {

//   },
//   debug: true
//   logLevel:
// }
interface ICors {
  enable?: boolean | false;
  opts?: object;
}
interface IServe {
  enable?: boolean | false;
  root: string;
  opts?: object;
}
interface IView {
  enable?: boolean | false;
  root: string;
  opts?: object;
}
interface IJwt {
  enable?: boolean | false;
  secret?: string;
  issuer?: string;
  debug: boolean;
  unless?: Array<string>;
}
interface IConfig {
  name: string | 'tomapp';
  base?: string;
  port?: number | 3000;
  debug?: boolean | false;
  mount?: string;
  buildin: {
    serve?: IServe;
    cors?: ICors;
    view?: IView;
    jwt?: IJwt;
  };
  beforeAll: any;
}
export async function createApp(cfg: IConfig) {
  const rpc = createServer(
    Object.assign(
      {
        base: import.meta.url,
      },
      cfg
    )
  );

  const cors = new Cors(cfg.buildin.cors);
  rpc.plugin(cors);

  const serve = new Serve(cfg.buildin.serve);
  rpc.plugin(serve);

  const view = new View(cfg.buildin.view);
  rpc.plugin(view);

  // await mount(rpc, cfg.mount);
  // await loadInitMiddleware(rpc, init);
  // await loadBuildinMiddlewaire(rpc);

  // rpc[load].push([someMw])
  // mount with lifecycle

  // await loadCustomMiddlewaire(rpc);

  // console.dir(mount);
  // if (cfg.mount) {
  //   rpc.base = import.meta.url;
  //   // await mount(rpc, './fn');
  // }

  return Object.assign(rpc, {
    // start: function () {
    //   // if (cfg.debug) {
    //   //   rpc.dump();
    //   // }
    //   rpc.start(cfg.port);
    // },
  });
}
