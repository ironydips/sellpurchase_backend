'use strict';

//============================= Load Modules Start ============================

//============================= Load external modules =========================


//============================= Load internal modules =========================

const appUtil = require("../../appUtils");

//============================= Load Modules End ==============================

const env = (() => {
  let Config;
  switch (appUtil.getNodeEnv()) {
    case 'dev':
    case 'development':
      Config = require('./dev');
      break;
    case 'stag':
    case 'staging':
      Config = require('./staging');
      break;
    case 'prod':
    case 'production':
      Config = require('./prod');
      break;
    case 'local':
      Config = require('./local');
      break;
    default:
      Config = require('./default');

  }

  let config = new Config();
  return config.getConfigs();
})();

module.exports = env;
