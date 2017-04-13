/**
 * Created by madhukar on 6/1/17.
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
const FactorCategoriesModel = require('../model/FactorCategories');
const FactorsModel = require('../model/Factors');
const appUtils = require('../appUtils');
const appConstants = require('../constants');
const FactorCategoriesDao = new baseDao(FactorCategoriesModel);
const factorsDao = new baseDao(FactorsModel);

const factorBasic = { '_id': 1, 'name' : 1 , 'type':1, 'frequency' : 1 , 'goal' : 1 , 'global' : 1, 'creator' : 1}
const SORT_BY = {
  name: "name"

};

function getCategories(filters , options) {
  let {search} = _.pick(filters,
    ['search']);

  let query = {};
  let orSearchQuery = [];
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    orSearchQuery.push({'name': regularExpression});
    query['$or'] = orSearchQuery;
  }

  console.log(`log query ${JSON.stringify(query)}`);
  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([FactorCategoriesDao.find(query, factorBasic , sortSkipLimitParams ), FactorCategoriesDao.count(query)])
    .then(result => {
      return {
        logInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });
}

function getAssignFactors(factorIds, filters = {}, options = {}) {
  let {search} = _.pick(filters,
    ['search']);

  let query = {};
  query._id = {"$in" :factorIds};

  let orSearchQuery = [];
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    orSearchQuery.push({'name': regularExpression});
      query['$or'] = orSearchQuery;
  }

  console.log(`log query ${JSON.stringify(query)}`);
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([factorsDao.find(query, factorBasic , sortSkipLimitParams ), factorsDao.count(query)])
    .then(result => {
      return {
        logInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });
}


function getUnAssignFactors(factorIds, filters = {}, options = {}) {
  let {search} = _.pick(filters,
    ['search']);

  let query = {};
  query._id = {"$nin" :factorIds};

  let orSearchQuery = [];
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    orSearchQuery.push({'name': regularExpression});
    query['$or'] = orSearchQuery;
  }

  console.log(`log query ${JSON.stringify(query)}`);
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([factorsDao.find(query, factorBasic , sortSkipLimitParams ), factorsDao.count(query)])
    .then(result => {
      return {
        logInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });
}

function getCategoryNameMap(categoryIds) {
  var query = {};
  query._id = {$in : categoryIds};
  return FactorCategoriesDao.find(query ,{'_id' :1 ,'name' : 1});
}


function removeFactor(factcorId) {
  return factorsDao.remove({"_id" : factcorId});
}

function getCsfById(factorId) {
  return factorsDao.find({"_id" : factorId});
}

function isCategoryExists(cName) {
  return FactorCategoriesDao.count({"name": cName});
}

function addCategory(cName) {
  return FactorCategoriesDao.save({"name": cName});
}

function findCategoryById(cId) {
  return FactorCategoriesDao.count({"_id": cId});
}

function editCategory(cId ,cName){
  return FactorCategoriesDao.findOneAndUpdate({"_id" : cId} ,{$set : {"name" : cName}});
}


function removeCategory(cId) {
  return FactorCategoriesDao.remove({"_id": cId});
}

function unsetCIdfromFactors(cId) {
  return factorsDao.update({"category" : cId} ,{$unset : {"category" : 1}} ,{multi : true});
}




//========================== Export Module Start ===========================


module.exports = {
  getCategories  , getAssignFactors , getUnAssignFactors , getCategoryNameMap , removeFactor , getCsfById ,isCategoryExists,addCategory,
  findCategoryById ,editCategory ,removeCategory ,unsetCIdfromFactors
};

//========================== Export module end ==================================
