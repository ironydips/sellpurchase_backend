/**
 * Created by madhukar on 4/1/17.
 */

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

let _ = require("lodash");
const mongoose = require('mongoose');

//========================== Load internal modules ====================

// Load base dao
const baseDao = require('./baseDao');
// Load Rules Model
const rulesModel = require('../model/Rules');
const appUtils = require('../appUtils');

//========================== Load Modules End =======================

const rulesDao = new baseDao(rulesModel);

const PROJECTION = {
  _ID: {_id: 1},
  NAME: {name: 1, _id: 1}
};
const SORT_BY = {name: 'name'};


function addUserIdToRule(params) {
  let query = {_id: params.ruleIds};
  let update = {'$addToSet': {users: params.userId}};

  return rulesDao.update(query, update);
}

function usersRules(filters, options = {}) {
  let {userIds = []} = _.pick(filters, ['userIds']);

  let query = {};
  let projection = PROJECTION._ID;

  query.users = {$in: userIds};
  if (options.fields) {
    projection = options.fields;
  }
  return rulesDao.find(query, projection);
}

function assignRulesToUser(filters) {
  let query = {_id: {$in: filters.rulesIdsToAssign}};
  let docToUpdate = {$addToSet: {users: filters.userToAssignRule}};
  return rulesDao.update(query, docToUpdate, {multi: true});
}

function unAssignISoftRules(filters) {
  let {userId, rulesIds} = _.pick(filters, ['userId', 'rulesIds']);
  let query = {_id: {$in: rulesIds}};
  let docToUpdate = {$pull: {users: userId}};

  return rulesDao.update(query, docToUpdate, {multi: true});
}

function getUserRules(filters, options = {}) {
  let query = {};
  let projection = PROJECTION.NAME;

  query.users = filters.userId;
  if (options.fields) {
    projection = options.fields;
  }
  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;

  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.NAME;
  }

  let promiseList = [];
  promiseList.push(rulesDao.find(query, projection, sortSkipLimitParams));

  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(rulesDao.count(query));
  }

  return addPagingInfo(promiseList, "rulesInfo", options);
}

//========================== Export Module Start ===========================


module.exports = {
  PROJECTION, addUserIdToRule, usersRules, assignRulesToUser, unAssignISoftRules, getUserRules
};

//========================== Export module end ==================================

function addPagingInfo(promiseList, responseKey, options) {
  return Promise.all(promiseList)
    .then(result => {
      let response = {};
      response[responseKey] = result[0];
      if (result[1]) {
        response.pagingInfo = {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        };
      }

      return response;
    });
}
