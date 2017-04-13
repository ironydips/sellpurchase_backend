/**
 * Created by madhukar on 2/1/17.
 */

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load log service
var logService = require('../services/logService');
var Promise = require("bluebird");
const _ = require("lodash");


//Load JWt Service
const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

function listLogs(filters, options) {
  return logService.listLogs(filters, options)
    .then(function (logInfo) {
      return logInfo;
    });
}


//========================== Export Module Start ===========================

module.exports = {
  listLogs
};

//========================== Export module end ==================================
