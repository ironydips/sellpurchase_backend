"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');

//========================== Load internal modules ====================
// Load company service
const nationalService = require('../services/nationalService'),
  companyService = require('../services/adminService'),
  appUtils = require('../appUtils'),
  exceptions = require('../customExceptions'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

/**
 * @function getNationals
 * @param {Object} nationalInfo details
 */
function getNationals(filters, options) {
  return nationalService.getNationals(filters, options);
}

function deleteNational(filters) {
  return companyService.unsetNationalInCompanies(filters)
    .then(function (result) {
      console.log(`delete national from companies result ${JSON.stringify(result)}`);
      return nationalService.deleteNationalById(filters);
    }).then(function (result) {
      result = result.result;
      console.log(`delete national result ${JSON.stringify(result)}`);
      if (result.ok == 1) {
        return appConstants.MESSAGES.succesfullyDeleted;
      } else {
        throw exceptions.unableToDeleteCompany();
      }
    });
}

function addNational(nationalDetails) {
  return nationalService.findNationalByName(nationalDetails)
    .then(result => {
      if (result) {
        throw exceptions.validationError(appConstants.MESSAGES.nationalNameAlreadyExist);
      } else {
        return nationalService.addNational(nationalDetails);
      }
    });
}

/**
 * get Detail of national
 * @param params
 * @returns {Promise|Promise.<TResult>|*}
 */
function getNational(filters) {
  return nationalService.getNational(filters);
}

/**
 *  update national company
 * @param params
 * @returns {Promise|Promise.<TResult>|*}
 */
function updateNational(nationalDetails) {
  return nationalService.updateNational(nationalDetails)
    .then(function (result) {
      return companyService.updateNationalInCompanies(nationalDetails);
    })
    .then(result => {
      return appConstants.MESSAGES.successfullyUpdated;
    });
}
//========================== Export Module Start ==============================

module.exports = {
  deleteNational,
  addNational,
  getNational,
  getNationals,
  updateNational
};

//========================== Export Module End ===============================
