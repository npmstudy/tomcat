import { createServer } from './src/index';

const rpc = createServer({});

rpc.plugin();
rpc.plugin();

rpc.listen(3000);
