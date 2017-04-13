"use strict";
//========================== Load Modules Start ===========================

//========================== Load internal Module =========================

const authentication = require("./authentication"),
  authorization = require("./authorization"),
  validators = require("./validators"),
  verification = require("./verification");

//========================== Load Modules End =============================

//========================== Export Module Start ===========================

module.exports = {
  validators,
  verification,
  authorization,
  authentication,
};
//========================== Export module end ==================================
