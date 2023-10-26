import mount from './index';
(async () => {
  const files = await mount('../f');
  console.dir(files);
})();
