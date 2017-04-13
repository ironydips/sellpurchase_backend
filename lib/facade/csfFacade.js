/**
 * Created by madhukar on 4/1/17.
 */

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load log service
var csfService = require('../services/csfService');
var Promise = require("bluebird");
const _ = require("lodash");


//Load JWt Service
const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

function submitCSFData(csfData) {
  return csfService.submitCSFData(csfData)
    .then(function (data) {
      return data;
    });
}

function editCSFData(csfData) {
  return csfService.editCSFData(csfData)
    .then(function (data) {
      return data;
    });
}

function addCSF(csfData) {
  return csfService.addCSF(csfData)
    .then(function (data) {
      return data;
    });
}

function assignFactor(assignData) {
  return csfService.assignFactor(assignData)
}

function unAssignFactor(unAssignData) {
  return csfService.unAssignFactor(unAssignData)
}

function listFactors(userId, filter, options) {
  return csfService.listFactors(userId, filter, options);
}

function getCsf(filter, option) {
  return csfService.getCsf(filter, option)
}

function getCategories(filters, options) {
  return csfService.getCategories(filters, options);
}

function removeCsf(factorId) {
  return csfService.removeCsf(factorId)
    .then(function (data) {
      return csfService.removeFactor(factorId)
    })
}

function getCsfById(factorId) {
  return csfService.getCsfById(factorId);
}

function createCategory(cName) {
  return csfService.createCategory(cName);
}

function editCategory(cId, cName) {
  return csfService.editCategory(cId,cName);
}

function removeCategory(cId) {
  return csfService.removeCategory(cId);
}

//========================== Export Module Start ===========================

module.exports = {
  submitCSFData,
  editCSFData,
  addCSF,
  assignFactor,
  listFactors,
  unAssignFactor,
  getCsf,
  getCategories,
  removeCsf,
  getCsfById,
  createCategory,
  editCategory,
  removeCategory
};

//========================== Export module end ==================================
