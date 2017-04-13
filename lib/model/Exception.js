"use strict";

//========================== Class Definitions Start =====================

class Exception {
  constructor(errorCode, msg, errStackTrace) {
    this.errorCode = errorCode;
    this.msg = msg;
    if (errStackTrace) {
      this.err = errStackTrace;
    }
  }
}

//========================== Class Definitions End =======================

//========================== Export module start ==================================

module.exports = Exception;

//========================== Export module end ==================================
