"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

let _ = require("lodash");

//========================== Load internal modules ====================

// Load app constant
const appConst = require('../constants');
// Load base dao
const BaseDao = require('./baseDao');
// Load User Model
const ReportModel = require('../model/Reports');
const appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

const reportDao = new BaseDao(ReportModel);

//Define Projections
const PROJECTION = {
  ALL: {},
  DETAIL: {profile: 1, roles: 1, emails: 1, company: 1, disabled: 1},
  BASIC_PROFILE: {profile: 1},
  COMPANY_BASIC_PROFILE: {"company._id": 1, "company.profile": 1},
  FACTOR: {"factors._id": 1, "factors.goal": 1},
};

const SORT_BY = {name: 'profile.firstName', email: 'emails.address', company: 'company.profile.name', roles: 'roles'};

function reportDetail(filters) {
  return reportDao.findOne({_id: filters.reportId});
}

//========================== Export Module Start ==================

module.exports = {
  PROJECTION, reportDetail
};

//========================== Export module end ==================================
