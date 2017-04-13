/**
 * Created by madhukar on 2/1/17.
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
// Load log Model
const logModel = require('../model/Logs');
const appUtils = require('../appUtils');
const appConstants = require('../constants');


const logBasics = { '_id': 1, 'who' : 1 , 'whom':1, 'when' : 1 , 'factor' : 1 , 'submitDate' : 1, 'old' : 1, 'new' : 1};
const logDao = new baseDao(logModel);
const SORT_BY = {
  who: "who.name",
  affectedUser :"whom.name",
  company:"whom.company",
  date: "when",
  csfName: "factor",
  submitCSFDate: "submitDate",
  oldVale: "old",
  newValue: "new"
};


function getLogs(filters = {}, options = {}) {
  let {search, companyId, log} = _.pick(filters,
    ['search', 'companyId', 'log']);

  let query = {};

  let orSearchQuery = [];
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    orSearchQuery.push({'who.name': regularExpression});
    orSearchQuery.push({'whom.name': regularExpression});
    orSearchQuery.push({'factor': regularExpression});
    query['$or'] = orSearchQuery;
  }

  if (companyId) {
    query['whom.company'] = companyId;
  }


  console.log(`log query ${JSON.stringify(query)}`);
  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.who;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([logDao.find(query, logBasics , sortSkipLimitParams ), logDao.count(query)])
    .then(result => {
      return {
        logInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });
}

function saveLogs(logData) {
  return logDao.save(logData)
}



//========================== Export Module Start ===========================


module.exports = {
  getLogs , saveLogs
};

//========================== Export module end ==================================
