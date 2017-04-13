/**
 * Created by madhukar on 2/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


//========================== Load internal modules ====================

// Load log dao
const logDao = require('../dao/logDao');
//Load JWt Service
const jwtHandler = require('../jwtHandler');
const appUtils = require('../appUtils');
var exceptions = require("../customExceptions");

//========================== Load Modules End ==============================================

/**
 *
 * @param options
 * @param filters
 * @returns {Promise.<T>|Promise}
 */

function listLogs(filters, options) {
  return logDao.getLogs(filters, options)
    .then(function ({logInfo, pagingInfo}) {
      return {logInfo, pagingInfo};
    })
    .catch(function (err) {
      throw err;
    });
}


//========================== Export Module Start ===========================

module.exports = {
  listLogs
};

//========================== Export module end ==================================
