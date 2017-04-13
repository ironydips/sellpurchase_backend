'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class StagingConfig extends DefaultConfig {
  constructor() {
    super();

    // override dev property, should be constants
    this.TAG = "staging";
    this.hostIP = '52.41.4.104';
    this.hostName = 'dev.algoworks.com';
  }
}

//========================== Class Definitions End =======================

module.exports = StagingConfig;
