"use strict";

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

//========================== Load Internal Modules ==========================

var appConst = require('../constants');

//========================== Load Modules End ==========================

//========================== Class Definitions Start =====================

class APIResponse {
  constructor(sc, result) {
    this.sc = sc;
    if (sc == appConst.STATUS_CODE.SUCCESS) {
      result ? this.result = result : appConst.EMPTY;
    } else {
      result ? this.error = result : appConst.EMPTY;
    }
    this.time = new Date().getTime();
  }
}

//========================== Class Definitions End =======================

//========================== Export module start ==================================

module.exports = APIResponse;

//========================== Export module end ==================================
