import { combine, RpcServer } from '@tomrpc/core';
import type { IIndexServerConfig, JSONValue } from '@tomrpc/core';
// import mount from '@tomrpc/mount';
import debug from 'debug';

import { Serve, Cors, View, Jwt } from './mw/index';
import { mergeDeep } from './utils';

const log = debug('@tomrpc/app');

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
  unless?: JSONValue;
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
    log('AppServer constructor');
    super(cfg);

    if (cfg?.buildin?.cors) {
      log('cors enable');
      const cors = new Cors(cfg?.buildin?.cors);
      this.plugin(cors);
    }

    if (cfg?.buildin?.serve) {
      log('serve enable');
      const serve = new Serve(cfg?.buildin?.serve);
      this.plugin(serve);
    }

    if (cfg?.buildin?.jwt) {
      log('jwt enable');
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
