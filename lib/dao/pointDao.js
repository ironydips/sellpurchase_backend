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
const PointsModel = require('../model/Points');
const appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

const pointsDao = new BaseDao(PointsModel);

//Define Projections
const PROJECTION = {
  ALL: {},
  DETAIL: {_id: 1, profile: 1, roles: 1, emails: 1, company: 1, disabled: 1},
  BASIC_PROFILE: {_id: 1, profile: 1},
  FACTOR: {"factors._id": 1, "factors.goal": 1},
  FACTOR1: {"factors._id": 1}
};

const SORT_BY = {name: 'profile.firstName', email: 'emails.address', company: 'company.profile.name', roles: 'roles'};

function pointsDetail(filters, options) {
  let query = {};
  let projection = PROJECTION.ALL;

  if (filters.pointsIds && filters.pointsIds.length > 0) {
    query["_id"] = {$in: filters.pointsIds};
  }

  return pointsDao.find(query, projection);
}

//========================== Export Module Start ==================

module.exports = {
  PROJECTION,
  pointsDetail
};

//========================== Export module end ==================================
