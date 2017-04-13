/**
 * Created by madhukar on 13/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

let _ = require("lodash");

//========================== Load internal modules ====================

// Load app constant
const appConst = require('../constants');
// Load base dao
const baseDao = require('./baseDao');
// Load leader Model
const leaderModel = require('../model/Leaderboards');
const appUtils = require('../appUtils');
const appConstants = require('../constants');
const leaderDao = new baseDao(leaderModel);
const leaderBasic = {"_id" : 1 ,"name" : 1 , "factorsFilter" : 1 , "from" : 1 , "to" : 1}
const leaderDetail  = {"_id" : 1 ,"name" : 1 , "factorsFilter" : 1 , "from" : 1 , "to" : 1 ,"category" : 1}
const SORT_BY = {
  name: "name",
  date :"from",
  csf:"factorFilter",

};

function getLeaders(filters = {}, options = {}) {
  let {search, companyId} = _.pick(filters,
    ['search', 'companyId']);

  let query = {};

  let orSearchQuery = [];
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    orSearchQuery.push({'name': regularExpression});
    query['$or'] = orSearchQuery;
  }

  if (companyId) {
    query['company'] = companyId;
  }


  console.log(`log query ${JSON.stringify(query)}`);
 // options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([leaderDao.find(query,leaderBasic, sortSkipLimitParams ), leaderDao.count(query)])
    .then(result => {
      return {
        leaderInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });
}

function removelBoard(lId) {
  return leaderDao.remove({"_id" : lId});
}

function lBoardDetail(lId) {
  var query = {"_id" : lId};
  return leaderDao.findOne(query , leaderDetail );
}

function addLeader(leaderObj) {
  return leaderDao.save(leaderObj);
}
function isLeaderExist(lId) {
  var query = {"_id" : lId};
  return leaderDao.findOne(query , {"_id" : 1} );
}

function updateLeaderBoard(lbId , fields) {
  return leaderDao.findOneAndUpdate({"_id" : lbId} , {$set : fields});
}

module.exports = {
  getLeaders , removelBoard , lBoardDetail ,addLeader ,isLeaderExist ,updateLeaderBoard
};
