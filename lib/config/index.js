'use strict';

//============================= Load Modules Start ============================

//============================= Load external modules =========================

//============================= Load internal modules =========================

const env = require("./env");
const dbMngr = require("./dbManager");
const expressConfig = require("./expressConfig");

//============================= Load Modules End ==============================


//Export config module
module.exports = {
  env,
  dbMngr,
  expressConfig
}
