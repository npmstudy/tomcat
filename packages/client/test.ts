import { createClient } from './src/index';

const main = async () => {
  const client = createClient({
    host: '127.0.0.1',
    port: 3000,
    namespace: 'default',
  });
  // const a = await client.a('hello', 'world');
  console.dir(client);

  const b = await client.a('hello', 'world');
  // console.dir(b);
};

main();
