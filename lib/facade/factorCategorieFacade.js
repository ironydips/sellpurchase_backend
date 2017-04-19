/**
 * Created by madhukar on 6/1/17.
 */

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load log service
var factorCategorieService = require('../services/commonService');
var Promise = require("bluebird");
const _ = require("lodash");


//Load JWt Service
const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

function newFactor() {
   return factorCategorieService.getCategories()
   .then(function (data) {
     var obj = {};
     obj.categories = data;
     obj.frequency = [ 'daily','weekly','monthly','quarterly','annually'];
     obj.type = ['number','currency','time'];
     obj.currency = ['dollar', 'euro','pound','singapore dollar','peso','koruna','australian dollar' ]
     return obj;
  })

}


//========================== Export Module Start ===========================

module.exports = {
  newFactor
};

//========================== Export module end ==================================
