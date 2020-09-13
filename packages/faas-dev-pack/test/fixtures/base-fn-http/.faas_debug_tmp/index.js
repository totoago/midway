const { FaaSStarter } = require('@midwayjs/faas');
const { asyncWrapper, start } = require('/Users/soar.gy/project/faas/github/midway/packages/serverless-fc-starter/dist/index.js');
const picomatch = require('picomatch');


let starter;
let runtime;
let inited = false;

const initializeMethod = async (initializeContext = {}) => {
  
  runtime = await start({
    layers: [],
    getHandler: getHandler
  });
  starter = new FaaSStarter({ baseDir: __dirname, initializeContext, applicationAdapter: runtime });
  
  starter.loader.loadDirectory({ baseDir: '/Users/soar.gy/project/faas/github/midway/packages/faas-dev-pack/test/fixtures/base-fn-http/.faas_debug_tmp/faas_tmp_out/src'});
  await starter.start();
   inited = true; 
};

const getHandler = (hanlderName) => {
  
    if (hanlderName === 'handler') {
      return  starter.handleInvokeWrapper('index.handler'); 
    }
  
}


exports.initializer = asyncWrapper(async (...args) => {
  if (!inited) {
    await initializeMethod(...args);
  }
});


exports.handler = asyncWrapper(async (...args) => {
  if (!inited) {
    await initializeMethod();
  }

  const handler = getHandler('handler');
  return runtime.asyncEvent(handler)(...args);
});