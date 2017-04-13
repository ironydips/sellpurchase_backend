'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class DevConfig extends DefaultConfig {
  constructor() {
    super();

    // override dev property
    this.TAG = "development";
    this.hostIP = '52.41.4.104';
    this.hostName = 'dev.algoworks.com';
  }
}

//========================== Class Definitions End =======================

module.exports = DevConfig;
