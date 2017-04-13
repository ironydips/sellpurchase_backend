/**
 * Created by madhukar on 4/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


//========================== Load internal modules ====================
const _ = require("lodash");
const moment = require("moment");

// Load log dao
var logDao = require("../dao/logDao");
var csfDao = require("../dao/csfDao");
var userDao = require("../dao/userDao");
var factorDao = require("../dao/factorCategorieDao");
//Load JWt Service
var jwtHandler = require("../jwtHandler");
var appUtils = require("../appUtils");
var exceptions = require("../customExceptions");
const appConstants = require("../constants");

//========================== Load Modules End ==============================================

/**
 *
 * @param options
 * @param filters
 * @returns {Promise.<T>|Promise}
 */

function submitCSFData(csfData) {
  var cData = csfData;
  return csfDao.pullCSFData(cData)
    .then(function (da) {
      return csfDao.submitCSFData(cData);
    })
    .then(function ({data}) {
      // find loggedIn user detail
      return userDao.findUserCompany(cData.loggedInUserId);
    })
    .then(function (userData) {
      var userN = userData[0].profile.firstName + " " + userData[0].profile.lastName;
      cData.userName = userN;
      //get User detail based on userId
      return userDao.findUserCompany(cData.userId);
    })
    .then(function (data) {
      var name = data[0].profile.firstName + " " + data[0].profile.lastName;
      cData.company = data[0].company.profile.name;
      cData.name = name;
      return updateLogs(cData);
    });
}

function editCSFData(csfData) {
  var cData = csfData;
  return csfDao.pullCSFData(cData)
    .then(function ({data}) {
      return csfDao.pushCSFData(cData);
    })
    .then(function (data) {
      return userDao.findUserCompany(cData.loggedInUserId);
    })
    .then(function (userData) {
      var userN = userData[0].profile.firstName + " " + userData[0].profile.lastName;
      cData.userName = userN;
      //get User detail based on userId
      return userDao.findUserCompany(cData.userId);
    })
    .then(function (data) {
      var name = data[0].profile.firstName + " " + data[0].profile.lastName;
      cData.company = data[0].company.profile.name;
      cData.name = name;
      return updateLogs(cData);
    });
}

function updateLogs(data) {
  if (!data.oldValue) {
    data.oldValue = null;
  }
  var obj = {
    "who": {
      "_id": data.loggedInUserId,
      "name": data.userName
    },
    "whom": {
      "_id": data.userId,
      "name": data.name,
      "company": data.company
    },
    "when": (new Date).getTime(),
    "factor": data.factorName,
    "old": data.oldValue,
    "submitDate": data.csfDate,
    "new": data.factorValue
  };

  return logDao.saveLogs(obj);

}

function addCSF(csfData) {
  //['csfCategory', 'csFrequency', 'csfType', 'csfName', 'csfGoal', "csfLimit", "isCreateNewCSF", "isSharable" , "csfCurrency"]);
  var obj = {
    "frequency": csfData.csfFrequency,
    "type": {
      "name": csfData.csfType,
      //   "value" : csfData.csfCurrency
    },
    "name": csfData.csfName,
    "goal": csfData.csfGoal,
    "limit": csfData.csfLimit,
    "global": csfData.isSharable,
    "creator": csfData.userId

  };
  if (csfData.csfType === "currency") {
    obj.type.value = csfData.csfCurrency;
  }

  var newCsf = csfData.isCreateNewCSF;
  if (newCsf) {
    return csfDao.findCSFByName(csfData.csfName)
      .then(function (data) {
        if (data) {
          throw exceptions.csfAreadyAdded(appConstants.MESSAGES.csfAlreadyAdded);
        } else {
          return csfDao.addCSF(obj)
            .then(function (data) {
              var ids = [];
              var csfId = data._id;
              if (csfData.addAssign) {

                if (csfData.userIds) {
                  ids.push(csfData.userIds);
                }
                var obj = {
                  "_id": csfId,
                  "goal": null,
                  "filled": []
                };
                return csfDao.assignfactorsToMultipleUsers(obj, ids);
              } else {
                return data;
              }
            });
        }

      });

  }

  return csfDao.addCSF(obj)
    .then(function (data) {
      var ids = [];
      var csfId = data._id;
      if (csfData.addAssign) {

        if (csfData.userIds) {
          ids.push(csfData.userIds);
        }
        var obj = {
          "_id": csfId,
          "goal": null,
          "filled": []
        };
        return csfDao.assignfactorsToMultipleUsers(obj, ids);
      } else {
        return data;
      }
    });
}

function assignFactor(factorData) {
  var arryObj = [];
  var factorObj = factorData.assignedObj;
  _.each(factorObj, function (data) {
    arryObj.push({
      "_id": data.csfId,
      "goal": data.goal,
      filled: []
    });
  });
  return csfDao.assignFactor(arryObj, factorData.userId)
    .then(function (data) {
      return csfDao.unAssignFactor(factorData);
    });

}

/*function listFactors(userId, filter, options) {
 var factors = null;
 var assignedData = null;
 return userDao.findFactorByUser(userId)
 .then(function (data) {
 let factorIds = _.map(data[0].factors, '_id');
 factors = factorIds;
 return factorDao.getAssignFactors(factorIds, filter, options);
 })
 .then(function (data) {
 assignedData = data;
 if (data.logInfo.length < 10) {
 return factorDao.getUnAssignFactors(factors, filter, options);
 }
 })
 .then(function (dataUnAssigned) {
 var array1 = dataUnAssigned.logInfo;
 if (dataUnAssigned.logInfo.length > 0) {
 _.forEach(dataUnAssigned.logInfo, function (data) {
 assignedData.logInfo.push(data);
 });
 }
 assignedData.pagingInfo.totalRecords = assignedData.pagingInfo.totalRecords + dataUnAssigned.pagingInfo.totalRecords;
 return assignedData;
 });
 }*/

function unAssignFactor(factorData) {
  return csfDao.unAssignFactor(factorData);

}

function listFactors(userId, filter, options) {
  var factors = null;
  var assignedData = null;
  var assignedIds = null;
  return userDao.findFactorByUser(userId)
    .then(function (data) {
      let factorIds = _.map(data[0].factors, "_id");
      factors = factorIds;
      return factorDao.getAssignFactors(factorIds, filter, options);
    })
    .then(function (data) {
      assignedData = data;
      let fIds = _.map(data.logInfo, "_id");
      assignedIds = fIds;
      if (assignedData.logInfo.length <= 10) {
        return factorDao.getUnAssignFactors(factors, filter, options);
      }
    })
    .then(function (dataUnAssigned) {
      var len = assignedData.logInfo.length;
      var array1 = dataUnAssigned.logInfo;
      if (dataUnAssigned.logInfo.length > 0) {
        _.forEach(dataUnAssigned.logInfo, function (data) {
          if (len < 10) {
            assignedData.logInfo.push(data);
            len = len + 1;
          }
        });
      }
      assignedData.pagingInfo.totalRecords = assignedData.pagingInfo.totalRecords + dataUnAssigned.pagingInfo.totalRecords;
      assignedData.assignIds = assignedIds;
      let cfIds = _.map(assignedData.logInfo, "_id");
      return userDao.getGoalByUserAndCSFIds(userId);
    })
    .then(function (data) {
      var goalObj = {};
      _.each(assignedIds, function (id) {
        _.each(data[0].factors, function (fi) {
          if (fi._id == id) {
            if (fi.goal) {
              goalObj[id] = fi.goal;
            }
            return;
          }
        });
      });
      assignedData.goalObj = goalObj;
      return assignedData;
    });
}

function getReportFactorDetail(factorEntities, filters) {
  let {dateFrom, dateTo, categoriesIds = [], factorsIds, disableDaysCalculation} =
    _.pick(filters, ["dateFrom", "dateTo", "categoriesIds", "factorsIds", "disableDaysCalculation"]);

  let factorsForPoints = {};

  let promiseList = [], userGoalList = [];
  // populate each factor with parent info and filter factors filled data based on date(from/to)
  for (let i = 0; i < factorEntities.length; i++) {
    userGoalList.push(factorEntities[i].goal);
    promiseList.push(csfDao.findFactorByFactorId({factorId: factorEntities[i]._id})
      .then(function (factorDetail) {
        let userGoal = userGoalList[i];
        _.assign(factorEntities[i], factorDetail);

        if (/*breakLevel === 'individual' && */typeof userGoal !== "undefined" && userGoal !== null) {
          factorEntities[i].goal = userGoal;
        }

        // filter filled factors based on date from and date to
        factorEntities[i].filled = _.filter(factorEntities[i].filled, function (filled) {
          let date = moment(new Date(filled.date));
          let afterDateFrom = moment(date).diff(dateFrom, "days") >= 0;
          let beforeDateTo = moment(date).diff(dateTo, "days") <= 0;

          return filled.date !== null && afterDateFrom && beforeDateTo &&
            ( typeof filled.value !== "undefined" && filled.value !== null && filled.value !== false );
        });

        factorEntities[i].filled = factorEntities[i].filled && factorEntities[i].filled.length ? factorEntities[i].filled : [{
          value: null,
          date: null
        }];

        return _.unwind(factorEntities[i], "filled");
      }));
  }

  return Promise.all(promiseList)
    .then(function (result) {
      return _.chain(result)
        .flatten()
        // filter factors by factors filter or categories filter
        .filter(function (factorEntity, index, factors) {
          if (_.includes(categoriesIds, factorEntity._id)
            && !(_.includes(categoriesIds, "misc") && !factorEntity.category)
            && !(factorEntity.category && _.includes(categoriesIds, factorEntity.category) )) {
            factorEntity.category = factorEntity._id;
          }

          console.log("factorEntity =", JSON.stringify(factorEntity));
          if (categoriesIds && categoriesIds.length) {
            return typeof factorEntity.category === "undefined" || factorEntity.category === null ?
              ( _.includes(categoriesIds, "misc") || _.includes(categoriesIds, factorEntity._id) )
              : ( _.includes(categoriesIds, factorEntity.category) );
          } else {
            return /*!isAllEntitiesVisible && */factorsIds && factorsIds.length ?
              _.includes(_.pick(factorsIds, "_id"), factorEntity._id)
              : true;
          }
        })
        // group filled factors by entity id
        .groupBy("entityId")
        .map(function (entityFactors, index) {
          console.log("entityFactors =", JSON.stringify(entityFactors));

          let _id = index,
            valueSum, finalFactors,
            user, teamNames, company, companyName;

          factorsForPoints[_id] = [];
          // get final factor array (with computed values)
          finalFactors = _.chain(entityFactors)
          // group factors by id
            .groupBy(categoriesIds.length ? "category" : "_id")
            .map(function (innerFactors, index) {
              var goalSum = 0,
                dateToWeekday = moment(dateTo).day(),
                daysDifference, resultFactor, innerFactor;

              // check if at least one value is filled
              var hasNotNullValue = _.find(_.pick(innerFactors, "filled"), function (filled) {
                var value = filled && filled.value;
                return /*checkPeriod(filled) && */typeof value === "number" && !isNaN(value);
              });

              let dayValues = [];

              // calculate value sum for each factor group
              valueSum = !hasNotNullValue ? null : _.chain(innerFactors)
                  .reduce(function (res, factor) {
                    var type = factor.type && factor.type.name || "number";
                    var factorForPoints = factorsForPoints[_id].find(function (f) {
                      return f._id === factor._id;
                    });

                    if (!disableDaysCalculation) {
                      var dayValue = dayValues.find(value => value.date === factor.filled.date);
                      if (!dayValue) {
                        dayValues.push(dayValue = {date: factor.filled.date, value: {}, goal: 0});
                      }

                      if (type !== "currency") {
                        dayValue.value[type] = dayValue.value[type] || 0;
                        dayValue.value[type] += appUtils.round(factor.filled.value) || 0;
                      } else {
                        dayValue.value[factor.type.value] = dayValue.value[factor.type.value] || 0;
                        dayValue.value[factor.type.value] += appUtils.round(factor.filled.value) || 0;
                      }

                    }

                    if (type !== "currency") {
                      res[type] = res[type] || 0;
                      res[type] += appUtils.round(factor.filled.value) || 0;
                    } else {
                      res[factor.type.value] = res[factor.type.value] || 0;
                      res[factor.type.value] += appUtils.round(factor.filled.value) || 0;
                    }

                    if (!factorForPoints) {
                      factorsForPoints[_id].push(factorForPoints = {
                        _id: factor._id,
                        value: appUtils.round(factor.filled.value) || 0
                      });
                    } else {
                      factorForPoints.value += appUtils.round(factor.filled.value) || 0;
                    }

                    if (!disableDaysCalculation) {
                      if (!factorForPoints.days) factorForPoints.days = [];

                      let pointDayValue = factorForPoints.days.find(pointDay => pointDay.date === dayValue.date);

                      if (!pointDayValue) {
                        factorForPoints.days.push({
                          date: dayValue.date,
                          goal: null,
                          value: appUtils.round(factor.filled.value) || 0
                        });
                      } else {
                        pointDayValue.value += appUtils.round(factor.filled.value);
                      }
                    }

                    return res;
                  }, {})
                  .value();
            });
        }).value();
    });
}

function getCsf(filter, option) {
  var array = [];
  var creatorIds = null;
  var categoryIds = null;
  var resp = null;
  var csfIds = null;
  var csfCount = {};
  var totalFids = null;
  // find csf ids  by category
  return userDao.getCsfIdSByComapny(filter.companyId)
    .then(function (data) {
      _.forEach(data, function (objData) {
        let fIds;
        if (objData.factors) {
          fIds = _.map(objData.factors, "_id");
        } else {
          fIds = objData._id;
        }
        array.push(fIds);
      });
      totalFids = array;
      var factorIds = _.uniq(_.flatten(array));
      return csfDao.findFactorByFactorIds(factorIds, filter, option);
    })
    .then(function (csfData) {
      resp = csfData;
      creatorIds = _.uniq(_.map(csfData.logInfo, "creator"));
      csfIds = _.uniq(_.map(csfData.logInfo, "_id"));
      categoryIds = _.uniq(_.map(csfData.logInfo, "category"));

      return userDao.getCreatorNameMap(creatorIds);
    })
    .then(function (creatorMap) {
      // update data of resp based on cmap
      var hashmap = _.reduce(creatorMap, function (hash, value) {
        var key = value["_id"];
        hash[key] = value.profile.firstName + " " + value.profile.lastName;
        return hash;
      }, {});
      _.each(resp.logInfo, function (data) {
        data.creator = hashmap[data.creator];

      });
      return factorDao.getCategoryNameMap(categoryIds);
    })
    .then(function (categoryMap) {
      var cmap = _.reduce(categoryMap, function (hash, value) {
        var key = value["_id"];
        hash[key] = value.name;
        return hash;
      }, {});
      // to calculate top assigned count
      var totalMap = {};
      var fs = _.flatten(totalFids);
      var groupIds = _.groupBy(fs);
      _.each(csfIds, function (cs) {
        totalMap[cs] = groupIds[cs].length;
      });
      _.each(resp.logInfo, function (data) {
        data.value = totalMap[data._id];
        if (data.category) {
          data.category = cmap[data.category];
        }
      });
      return resp;
    });

}

function getCategories(filters, options) {
  return factorDao.getCategories(filters, options);
}

function getFactorsDetail(filters, options) {
  options.fields = csfDao.PROJECTION.GOAL_FREQ_ID_NAME;
  return csfDao.getFactorsDetail(filters, options);
}

function removeCsf(factorId) {
  return userDao.removeCsf(factorId);
}

function removeFactor(factorId) {
  return factorDao.removeFactor(factorId);
}

function getCsfById(factorId) {
  return factorDao.getCsfById(factorId);
}

function createCategory(cName) {
  if (!cName) {
    throw exceptions.resourceNotFound("please provide category name");
  }
  return factorDao.isCategoryExists(cName)
    .then(function (count) {
      if (count) {
        throw exceptions.categoryAlreadyExists("Category with " + cName + " already exists.");
      }
      return factorDao.addCategory(cName);
    });
}

function removeCategory(cId) {
  return factorDao.findCategoryById(cId)
    .then(function (count) {
      if (!count) {
        throw exceptions.categoryAlreadyExists("Category not found.");
      }
      return factorDao.removeCategory(cId)
        .then(function (data) {
          if (data) {
            return factorDao.unsetCIdfromFactors(cId);
          } else {
            throw exceptions.categoryAlreadyExists("Category not removed.");
          }
        });
    });
}

function editCategory(cId, cName) {
  if (!cId || !cName) {
    throw exceptions.resourceNotFound("please provide category name and category Id");
  }
  return factorDao.findCategoryById(cId)
    .then(function (count) {
      if (!count) {
        throw exceptions.categoryAlreadyExists("Category with " + cName + " not exists.");
      }
      return factorDao.editCategory(cId, cName);
    });

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
  getReportFactorDetail,
  getFactorsDetail,
  removeCsf,
  removeFactor,
  getCsfById,
  createCategory,
  removeCategory,
  editCategory

};

//========================== Export module end ==================================
