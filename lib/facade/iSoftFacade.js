"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');

//========================== Load internal modules ====================
// Load company service
const companyService = require('../services/adminService'),
  userService = require('../services/userService'),
  customExceptions = require('../customExceptions'),
  appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

/**
 * @function getCompanies
 * @param {Object} companyInfo details
 */
function findUserByISoftId(iSoftId) {
  if (!iSoftId) {
    throw customExceptions.provideISoftId();
  }
  return userService.findByISoftId(iSoftId);
}

function findUserByEmailIdAndISoftId(params) {
}

function findCmpnyByName(params) {

}

function addCmpnyByNameFromISoft(companyId) {

}

function findUserByEmailId(companyId) {
}

function updateUserFromISoft(companyId) {
}

function addUserFromISoft(companyId) {
}

function disableUserFromISoft(iSoftId) {
  let userInfo = userService.findByISoftId(iSoftId);
  if (!userInfo) {
    throw customExceptions.iSoftUserNotFound();
  }

  return userService.disableISoftUser(iSoftId);
}

//========================== Export Module Start ==============================

module.exports = {
  findUserByISoftId, findUserByEmailIdAndISoftId, findCmpnyByName, addCmpnyByNameFromISoft,
  findUserByEmailId, updateUserFromISoft, addUserFromISoft, disableUserFromISoft
};

//========================== Export Module End ===============================
