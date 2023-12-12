import { createServer, combine, RpcServer } from '@tomrpc/core';
import type { IIndexServerConfig } from '@tomrpc/core';
// import mount from '@tomrpc/mount';
import exp from 'constants';
import debug from 'debug';

import { init } from './init';
import { loadBuildinMiddlewaire, loadInitMiddleware } from './load';
import { Serve, Cors, View, Jwt } from './mw/index';
import { mergeDeep } from './utils';

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
  unless?: any;
  getToken;
}
interface IAppConfig1 {
  name?: string | 'tomapp';
  base?: string;
  port?: number | 3000;
  debug?: boolean | false;
  mount?: string;
  buildin?: {
    serve?: IServe;
    cors?: ICors;
    view?: IView;
    jwt?: IJwt;
  };
}

type IAppConfig = IAppConfig1 & IIndexServerConfig;

export class AppServer extends RpcServer {
  constructor(cfg?: IAppConfig) {
    super(cfg);

    if (cfg?.buildin?.cors) {
      const cors = new Cors(cfg?.buildin?.cors);
      this.plugin(cors);
    }

    if (cfg?.buildin?.serve) {
      const serve = new Serve(cfg?.buildin?.serve);
      this.plugin(serve);
    }

    if (cfg?.buildin?.jwt) {
      const jwt = new Jwt(cfg?.buildin?.jwt);
      this.plugin(jwt);
    }
  }

  public render(path, cb): void {
    // console.dir('render');
    if (this.config?.buildin?.view) {
      const view = new View(this.config?.buildin?.view);
      const mw = combine([view.proxy(), cb]);
      this.app.use(mw);
    }
  }
}

export function createApp(cfg?: IAppConfig): AppServer {
  return new AppServer(
    mergeDeep(
      {
        base: import.meta.url,
      },
      cfg || {}
    )
  );
}
