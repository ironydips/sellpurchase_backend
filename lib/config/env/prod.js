"use strict";

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class ProdConfig extends DefaultConfig {
  constructor() {
    super();
    this.TAG = "production";
  }
}

//========================== Class Definitions End =======================


module.exports = ProdConfig;
