/**
 * Created by madhukar on 13/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


//========================== Load internal modules ====================

// Load leaderDao
const leaderDao = require("../dao/leaderDao");
const userDao = require("../dao/userDao");
const csfDao = require("../dao/csfDao");
const companyDao = require("../dao/adminDao");
const _ = require("lodash")
//Load JWt Service
const jwtHandler = require("../jwtHandler");
const appUtils = require("../appUtils");
var exceptions = require("../customExceptions");

var acceptedFields = ["name", "showLeaders", "leaderCount", "categories", "factorsFilter", "period", "company"
  , "team", "breakLevel", "order","frequency", "date" , "time" , "day" ,"month" ,"receivers" ,"others" ,"from" ,"to"  ,'offset' ,'creator'];
//========================== Load Modules End ==============================================

/**
 *
 * @param options
 * @param filters
 * @returns {Promise.<T>|Promise}
 */

function listLeaders(filters, options) {
  return leaderDao.getLeaders(filters, options)
    .then(function ({leaderInfo, pagingInfo}) {
      return {leaderInfo, pagingInfo};
    })
    .catch(function (err) {
      throw err;
    });
}

function removelBoard(lId) {
  return leaderDao.removelBoard(lId)
    .then(function (data) {
      /*if (!data[0]) {
       throw exceptions.noLeaderBoardDeleted("Could not delete leaderboard.");
       }*/
      return data;
    });
}


function lBoardDetail(lId) {
  var leaderDetail = {};
  return leaderDao.lBoardDetail(lId)
    .then(function (leaderData) {
      var factorIds = leaderData.factorsFilter;
      leaderDetail.name = leaderData.name;
      leaderDetail.to = leaderData.to;
      leaderDetail.from = leaderData.from;
      return csfDao.getCsfByFactorIds(factorIds);
    })
    .then(function (data) {
      leaderDetail.csfDetail = data;
      return leaderDetail;
    });
}


function addLeader(lbData) {
  // var isAccess =  checkLeaderAddEditPermissions(lbData.loggedInUserId)
  var leaderObj = {};
  leaderObj.name = lbData.name;
  leaderObj.showLeaders = lbData.showLeaders;
  leaderObj.leaderCount = lbData.leaderCount;
  leaderObj.categories = lbData.categories;
  leaderObj.factorsFilter = lbData.factorsFilter;
  leaderObj.period = lbData.period;
  leaderObj.company = lbData.company;
  leaderObj.team = lbData.team;
  leaderObj.breakLevel = lbData.breakLevel;
  leaderObj.order = lbData.order;

  if (lbData.period == "custom" || lbData.period == "custom-to-date") {
    leaderObj.to = lbData.to;
    leaderObj.from = lbData.from;
  }
  // Send report By email
  // evy X days
  if (lbData.frequency && lbData.frequency == "x") {
    leaderObj.month = (lbData.month) ? lbData.month : "";
    leaderObj.date = (lbData.date) ? lbData.date : "";
    leaderObj.day = (lbData.day) ? lbData.day : "";
    leaderObj.time = lbData.time;
    leaderObj.frequency = lbData.frequency;
  }
  // daily
  if (lbData.frequency && lbData.frequency == "daily") {
    leaderObj.time = lbData.time;
    leaderObj.frequency = lbData.frequency;
  }
  // weekly , quarterly
  if (lbData.frequency && (lbData.frequency == "weekly" || lbData.frequency == "quarterly")) {
    leaderObj.month = (lbData.month) ? lbData.month : "";
    leaderObj.date = (lbData.date) ? lbData.date : "";
    leaderObj.day = (lbData.day) ? lbData.day : "";
    leaderObj.time = lbData.time;
    leaderObj.frequency = lbData.frequency;
  }
  // semi-annually & annually
  if (lbData.frequency && (lbData.frequency == "semi-annually" || lbData.frequency == "annually" )) {
    leaderObj.month = (lbData.month) ? lbData.month : "";
    leaderObj.date = (lbData.date) ? lbData.date : "";
    leaderObj.time = lbData.time;
    leaderObj.frequency = lbData.frequency;

  }
  // For Users
  if (lbData.receivers) {
    leaderObj.receivers = lbData.receivers;
  }
  // for email ids
  if (lbData.others) {
    leaderObj.others = lbData.others;
  }
  return leaderDao.addLeader(leaderObj);

}



function updateLeaderBoard(updateLBData) {
  var fields = {};
 // var isAccess =  checkLeaderAddEditPermissions(updateLBData.loggedInUserId)
  var isAccess = true;
  if (isAccess) {
    _.each(updateLBData.data[0], function (field, index) {
      if (acceptedFields.indexOf(index) > -1)
        fields[index] = field;
    });

    return leaderDao.updateLeaderBoard(updateLBData.id, fields);

  } else {
    exceptions.noUpdtaePermissions();
  }

}

/**
 * check if user is company
 * chief  or su || admin
 * @param userId
 */
function checkLeaderAddEditPermissions(userId) {
  return userDao.findUserCompanyId(userId)
    .then(function (data) {
      if (data && data._id) {
        return companyDao.isChiefCompany(data._id);
      }
      else {
        exceptions.companyNotFound();
      }
    })
    .then(function (data) {
      if (data) {
        return true;
      }
      return false;
    });
}

//========================== Export Module Start ===========================

module.exports = {
  listLeaders, removelBoard, lBoardDetail, addLeader, updateLeaderBoard
};

//========================== Export module end ==================================
