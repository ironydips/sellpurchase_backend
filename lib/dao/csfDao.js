/**
 * Created by madhukar on 4/1/17.
 */

"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

let _ = require("lodash");
let moment = require("moment");

//========================== Load internal modules ====================

// Load app constant
const appConst = require('../constants');
// Load base dao
const baseDao = require('./baseDao');
// Load User Model
const userModel = require('../model/Users');
const factorModel = require('../model/Factors');
const appUtils = require('../appUtils');
const appConstants = require('../constants');
var mongoose = require('mongoose');
const userDao = new baseDao(userModel);
const factorDao = new baseDao(factorModel);

var FactorAll = {
  "_id": 1,
  "name": 1,
  "type.name": 1,
  "type.currency": 1,
  "frequency": 1,
  "goal": 1,
  "global": 1,
  "creator": 1,
  "category": 1
};

const PROJECTION = {
  BASIC: {_id: 1, name: 1},
  GOAL_FREQ_ID_NAME: {_id: 1, goal: 1, frequency: 1, name: 1}
};

const SORT_BY = {name: 'name', frequency:'frequency' , goal: "goal" ,creator : "creator" ,category : "category"};

function submitCSFData(csfData) {
  var query = {'_id': csfData.userId, "factors": {"$elemMatch": {"_id": csfData.factorId}}};
  var update = {'$push': {"factors.$.filled": {"value": csfData.factorValue, "date": csfData.csfDate}}};
  return userDao.update(query, update);
}

function pullCSFData(csfData) {
  var query = {'_id': csfData.userId, "factors": {"$elemMatch": {"_id": csfData.factorId}}};
  var update = {'$pull': {"factors.$.filled": {"date": csfData.csfDate}}};
  return userDao.update(query, update);
}

function pushCSFData(csfData) {
  var query = {'_id': csfData.userId, "factors": {"$elemMatch": {"_id": csfData.factorId}}};
  var obj = {"value": csfData.factorValue, "date": csfData.csfDate};
  var update = {'$push': {"factors.$.filled": obj}};
  return userDao.update(query, update);
}

function addCSF(factorObj) {
  return factorDao.save(factorObj);
}

function assignFactor(obj, userId) {
  var query = {'_id': userId};
  var update = {'$push': {factors: {$each: obj}}}
  return userDao.update(query, update);
}

function assignfactorsToMultipleUsers(obj, userIds) {
  var query = {'_id': {$in: userIds}};
  var update = {'$push': {factors: obj}}
  return userDao.update(query, update);
}

function unAssignFactor(factorData) {
  var query = {'_id': factorData.userId};
  var update = {$pull: {"factors": {"_id": {$in: factorData.csfFactorIds}}}};
  return userDao.update(query, update);
}

function findFactorByFactorIds(csfIds, filters = {}, options = {}) {
  var query = {};
  query._id = {$in: csfIds};
  let orSearchQuery = [];
  if (filters.categoryId) {
    if (filters.categoryId == "Miscellaneous") {
      query.category = {$exists: false};
    }
    else {
      query.category = filters.categoryId;
    }
  }
  if (filters.search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(filters.search), 'gi');
    orSearchQuery.push({'name': regularExpression});
    query['$or'] = orSearchQuery;
  }
  //
  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(JSON.stringify(sortSkipLimitParams));
  return Promise.all([factorDao.findLean(query, FactorAll, sortSkipLimitParams), factorDao.count(query)])
    .then(result => {
      return {
        logInfo: result[0],
        pagingInfo: {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        }
      };
    });

}

function findFactorByFactorId(filters = {}, options = {}) {
  let factorId = filters.factorId;
  return factorDao.findOneLean({_id: factorId});
}

/*function getReportFactorDetail(reportingUserFactors) {
 // console.log(`factor entities ${JSON.stringify(entities)}`);
 let entities = _.chain(reportingUserFactors)
 // extend each user factor with actual factor info
 .map(function (factor) {

 var userGoal = factor.goal;

 // _.extend(factor, Factors.findOne(factor._id));

 // set user individual goal instead of factors default goals
 if (/!*breakLevel === 'individual' && *!/typeof userGoal !== 'undefined' && userGoal !== null)
 factor.goal = userGoal;

 // filled filter
 /!*factor.filled = _.filter(factor.filled, function (filled) {
 var date = moment(new Date(filled.date)),
 afterDateFrom = moment(date).diff(dateFrom, 'days') >= 0,
 beforeDateTo = moment(date).diff(dateTo, 'days') <= 0;

 return filled.date !== null
 && afterDateFrom && beforeDateTo
 && (
 typeof filled.value !== 'undefined'
 && filled.value !== null
 && filled.value !== false
 );
 });*!/

 factor.filled = factor.filled && factor.filled.length ? factor.filled : [{value: null, date: null}];
 return _.unwind(factor, 'filled');
 })
 .flatten()
 // filter factors by paramFactors or factorCategories
 .filter(function (factor, index, factors) {
 if (_.contains(factorCategories, factor._id)
 && !(_.contains(factorCategories, 'misc') && !factor.category)
 && !(factor.category && _.contains(factorCategories, factor.category) )) {
 factor.category = factor._id;
 }

 if (factorCategories && factorCategories.length) {
 return typeof factor.category === 'undefined' || factor.category === null ?
 ( _.contains(factorCategories, 'misc') || _.contains(factorCategories, factor._id) )
 : ( _.contains(factorCategories, factor.category) );
 } else {
 return !isAllEntitiesVisible && paramFactors && paramFactors.length ?
 _.contains(_.pluck(paramFactors, '_id'), factor._id)
 : true;
 }
 })
 // group filled factors by entity id
 .groupBy('entityId')
 .map(function (entityFactors, index) {
 var result = {},
 checkPeriod = function (filled) {
 var date = new Date(filled && filled.date),
 afterDateFrom = moment(date).diff(dateFrom, 'days') >= 0,
 beforeDateTo = moment(date).diff(dateTo, 'days') <= 0;
 return afterDateFrom && beforeDateTo
 },
 _id = index,
 valueSum, finalFactors,
 user, teamNames, company, companyName;

 factorsForPoints[_id] = [];

 // get final factor array (with computed values)
 finalFactors = _.chain(entityFactors)
 // group factors by id
 .groupBy(factorCategories.length ? 'category' : '_id')
 .map(function (innerFactors, index) {
 var goalSum = 0,
 dateToWeekday = moment(dateTo).day(),
 daysDifference, resultFactor, innerFactor;

 // check if at least one value is filled
 var hasNotNullValue = _.find(_.pluck(innerFactors, 'filled'), function (filled) {
 var value = filled && filled.value;
 return checkPeriod(filled) && typeof value === 'number' && !isNaN(value);
 });

 let dayValues = [];

 // calculate value sum for each factor group
 valueSum = !hasNotNullValue ? null : _.chain(innerFactors)
 .filter(function (factor) {
 return checkPeriod(factor.filled);
 })
 .reduce(function (res, factor) {
 var type = factor.type && factor.type.name || 'number';
 var factorForPoints = factorsForPoints[_id].find(function (f) {
 return f._id === factor._id;
 });

 if (!disableDaysCalculation) {
 var dayValue = dayValues.find(value => value.date === factor.filled.date);
 if (!dayValue) {
 dayValues.push(dayValue = {date: factor.filled.date, value: {}, goal: 0});
 }

 if (type !== 'currency') {
 dayValue.value[type] = dayValue.value[type] || 0;
 dayValue.value[type] += SW.round(factor.filled.value) || 0;
 } else {
 dayValue.value[factor.type.value] = dayValue.value[factor.type.value] || 0;
 dayValue.value[factor.type.value] += SW.round(factor.filled.value) || 0;
 }

 }

 if (type !== 'currency') {
 res[type] = res[type] || 0;
 res[type] += SW.round(factor.filled.value) || 0;
 } else {
 res[factor.type.value] = res[factor.type.value] || 0;
 res[factor.type.value] += SW.round(factor.filled.value) || 0;
 }

 if (!factorForPoints) {
 factorsForPoints[_id].push(factorForPoints = {
 _id: factor._id,
 value: SW.round(factor.filled.value) || 0
 });
 } else {
 factorForPoints.value += SW.round(factor.filled.value) || 0;
 }

 if (!disableDaysCalculation) {
 if (!factorForPoints.days) factorForPoints.days = [];

 let pointDayValue = factorForPoints.days.find(pointDay => pointDay.date === dayValue.date);

 if (!pointDayValue) {
 factorForPoints.days.push({
 date: dayValue.date,
 goal: null,
 value: SW.round(factor.filled.value) || 0
 });
 } else {
 pointDayValue.value += SW.round(factor.filled.value);
 }
 }

 return res;
 }, {})
 .value();

 // if all goals are not set, set goal sum to null
 var nullFactors = _.find(_.pluck(innerFactors, 'goal'), function (goal) {
 return goal !== null && typeof goal !== 'undefined';
 });
 if (typeof nullFactors === 'undefined') {
 goalSum = null;
 } else {
 // calculate goal sum for each factor group
 goalSum = _.chain(innerFactors)
 .groupBy('userId')
 .map(function (userFactors) {
 return _.chain(userFactors)
 .uniq(function (factor) {
 return factor._id;
 })
 .map(function (factor) {
 var goal = 0;
 var frequency;

 // NOWD ( Number Of Working Days );
 // FG ( Factor Goal )
 // GOAL = NOWD(from , to) * ( FG / NOWD(frequency)  )
 goal = factor.goal ? factor.goal * getGoalMultipler(dateFrom, dateTo, factor.frequency) : 0;

 return goal
 })
 .reduce(function (sum, goal) {
 return sum + goal;
 }, 0)
 .value();
 })
 .reduce(function (sum, goal) {
 return sum + goal;
 }, 0)
 .value();

 }

 innerFactor = innerFactors[0];

 if (!isAllEntitiesVisible && !factorCategories.length) {
 let displayed = _.find(paramFactors, function (displayedFactor) {
 return displayedFactor && innerFactor._id === displayedFactor._id;
 }) || {};

 let nonCompliantValues = Object.keys(valueSum || {}).filter(function (key) {
 let currValue = valueSum[key] || null;

 return displayed && conditions[displayed.condition] && !disableConditions && !conditions[displayed.condition](getValueForPeriod(currValue, displayed.period), +displayed.value);
 });

 if (displayed.condition && typeof displayed.value !== 'undefined' && displayed.value !== null
 && ( nonCompliantValues.length || valueSum === null )) valueSum = false;

 }

 Object.keys(valueSum || {}).forEach(key => {
 valueSum[key] = +(valueSum[key]).toFixed(2);
 });

 var goal = SW.round(goalSum);
 var value = valueSum;

 if (!factorCategories.length) {
 var percentage = ( (value && _.values(value)[0]) * 100.0 / goal).toFixed(2) || 0;
 percentage = !(percentage && isFinite(percentage) && !isNaN(percentage))
 ? '0.00%' : percentage + '%';
 }

 var factorCategory = factorCategories.length && FactorCategories.findOne(index) || {name: 'Miscellaneous'};

 if (factorCategories.length && (index === 'undefined' || index === 'null')) {
 index = 'Miscellaneous';
 }

 if (!disableDaysCalculation) {
 (dayValues || []).forEach(day => {
 let percentage = ((day.value && _.values(day.value)[0]) * 100.0 / day.goal).toFixed(2) || 0;
 day.percentage = !percentage || !isFinite(percentage) ? '0.00%' : percentage + '%';

 _.each(day.value, (value, key, obj) => {
 if (key === 'currency' || SW.currencies[key]) {
 obj[key] = SW.currencies[key] + value;
 } else if (key === 'time') {
 obj[key] = SW.parseTime(value);
 }
 });

 day.goal = +(goalSum * getGoalMultipler(
 moment(day.date, SW.getFormatDate()),
 moment(day.date, SW.getFormatDate()),
 'weekly'
 )).toFixed(2);

 day.value = typeof day.value === 'object' && day.value ?
 _.chain(day.value)
 .values()
 .value()
 .join(' / ')
 : day.value;

 if (innerFactor.type.name === 'time') day.goal = SW.parseTime(day.goal);
 });
 }

 resultFactor = {
 _id: index,
 name: factorCategories.length ? factorCategory.name : innerFactor.name,
 goal: goal,
 frequency: innerFactor.frequency || 'daily',
 value: ( value === false || _.size(value) > 1 ) ? value : value && _.values(value),
 days: dayValues || [],
 type: value === false ? 'false' : ( _.size(value) > 1 ? 'multiple' : innerFactor.type ),
 percentage: percentage
 };

 let pointFactor = factorsForPoints[_id].find(f => f._id === index);
 if (pointFactor) pointFactor.goal = resultFactor.goal;

 if (resultFactor.type !== 'false') {
 if (innerFactor.type && innerFactor.type.name === 'currency' || resultFactor.type === "multiple") {
 if (resultFactor.type === "multiple") {
 _.each(resultFactor.value, function (value, key, obj) {
 var currency = SW.currencies[key] || '';
 obj[key] = currency + value;
 })
 } else {
 if (resultFactor.value)
 resultFactor.value = (SW.currencies[innerFactor.type.value] || '') + resultFactor.value;
 }
 }

 if (innerFactor.type && innerFactor.type.name === 'time' || resultFactor.type === "multiple" && resultFactor.value.time) {
 if (resultFactor.type === "multiple") {
 resultFactor.value.time = SW.parseTime(resultFactor.value.time);
 } else {
 resultFactor.goal = SW.parseTime(resultFactor.goal);
 resultFactor.value = SW.parseTime(resultFactor.value);
 }
 }

 resultFactor.value = typeof resultFactor.value === 'object' && resultFactor.value ?
 _.chain(resultFactor.value)
 .values()
 .value()
 .join(' / ')
 : resultFactor.value;
 }

 // if (resultFactor.goal === '0:00')
 //   resultFactor.goal = '--';
 // if (resultFactor.value === '0:00')
 //   resultFactor.value = '--';

 return resultFactor;
 })
 // set factors, which values do not match the conditions, to null
 .value();

 result = {
 entityId: index === 'undefined' ? '--' : index,
 entityName: entityFactors[0].entityName,
 factors: finalFactors
 };

 if (breakLevel === 'team') {
 // add team name to the result
 if (index && index !== 'null') {
 company = Companies.findOne({'teams._id': index}, {fields: {'profile.name': 1}});
 companyName = company && company.profile.name || '--';
 } else {
 companyName = '--';
 }

 result.companyName = companyName;

 } else if (breakLevel === 'individual') {
 // add team and company names to the result
 user = Meteor.users.findOne({_id: index});
 companyName = user.company && user.company.profile.name || '--';

 if (user.teamId) {
 if (!_.isArray(user.teamId)) user.teamId = user.teamId.split(' ');

 company = Companies.findOne({'teams._id': {$in: user.teamId}}, {fields: {'teams': 1}});

 if (company && _.isArray(company.teams)) {
 teamName = [];
 company.teams.forEach(team => {
 if (team && user.teamId.indexOf(team._id) !== -1) {
 teamName.push(team.profile.name);
 }
 });
 } else {
 teamName = '--';
 }

 } else {
 teamName = '--';
 }

 result.companyName = companyName;
 result.teamName = teamName;
 }

 return result;

 })
 .map(function (entity) {
 entity.factors = entity.factors.filter(function (factor) {
 return factor._id && factor._id !== 'undefined' && factor._id !== 'null';
 });
 return entity;
 })
 .value();
 }*/

function getFactorsDetail(filters, options) {
  let {factorIds} = _.pick(filters, ['factorIds']);
  let query = {};
  let projection = PROJECTION.BASIC;

  if (factorIds && factorIds.length > 0) {
    query["_id"] = {$in: factorIds};
  }

  if (options.fields) {
    projection = options.fields;
  }

  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(`filters ${JSON.stringify(filters)}`);

  let promiseList = [];
  promiseList.push(factorDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(factorDao.count(query));
  }

  return addPagingInfo(promiseList, "factorInfo", options);
}

function getReportFactorDetail(filters, options) {
  console.log(JSON.stringify(filters));
}

function getCsfByFactorIds(fIds) {
  let query = {};
  query["_id"] = {$in: fIds};
  return factorDao.find(query, FactorAll);
}

function findCSFByName(name) {
  return factorDao.count({"name" : name});
}


//========================== Export Module Start ===========================

module.exports = {
  PROJECTION,
  submitCSFData,
  pullCSFData,
  pushCSFData,
  addCSF,
  assignFactor,
  unAssignFactor,
  findFactorByFactorIds,
  findFactorByFactorId,
  getFactorsDetail,
  getReportFactorDetail,
  getCsfByFactorIds,
  assignfactorsToMultipleUsers,
  findCSFByName

}

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
