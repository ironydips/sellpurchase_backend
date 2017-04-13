/**
 * Created by tushar on 11/8/16.
 */

"use strict";

//========================== Load Modules Start ===========================

//========================== Load Internal Module=========================

// Load exceptions
var appConst = require("./constants");
var excep = require("./customExceptions");
var APIResponse = require("./model/APIResponse");

//========================== Load Modules End =============================

function hndlError(err, req, res, next) {
  // unhandled error
  sendError(res, err);
}

function sendError(res, err) {
  // if error doesn't has sc than it is an unhandled error,
  // log error, and throw intrnl server error
  if (!err.errorCode) {
    console.log("unhandled error = ", err);
    err = excep.intrnlSrvrErr(err);
  }
  var result = new APIResponse(appConst.STATUS_CODE.ERROR, err);
  _sendResponse(res, result);
}

function sendSuccessWithMsg(res, msg) {
  var rslt = {message: msg}
  var result = new APIResponse(appConst.STATUS_CODE.SUCCESS, rslt);
  _sendResponse(res, result);
}

function sendSuccess(res, rslt = {}, message) {
  if (message) {
    rslt.message = message;
  }
  var result = new APIResponse(appConst.STATUS_CODE.SUCCESS, rslt);
  _sendResponse(res, result);
}

//========================== Exposed Action Start ==========================

module.exports = {
  hndlError, sendError, sendSuccess, sendSuccessWithMsg
};

//========================== Exposed Action End ==========================

function _sendResponse(res, rslt) {
  if (rslt && rslt.error && rslt.error.errorCode == 24) {
    return res.send(401);
  }
  // send status code 200
  return res.send(rslt);
}
