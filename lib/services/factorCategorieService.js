/**
 * Created by madhukar on 6/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


//========================== Load internal modules ====================

// Load log dao
const factorCategorieDao = require('../dao/factorCategorieDao');
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

function getCategories(filters, options) {
  return factorCategorieDao.getCategories();
}


//========================== Export Module Start ===========================

module.exports = {
  getCategories
};

//========================== Export module end ==================================
