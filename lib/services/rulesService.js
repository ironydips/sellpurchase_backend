"use strict";

//========================== Load Modules Start =======================

const _ = require("lodash");
const Promise = require("bluebird");

//========================== Load internal modules ====================

// Load rules dao
const rulesDao = require('../dao/rulesDao');

//========================== Load Modules End ==============================================

function mergeRules(selectedUserIds, userToInheritISRules) {
  if (_.isEmpty(selectedUserIds)) {
    return Promise.resolve({iSoftRules: []});
  }

  if (!_.isArray(selectedUserIds)) {
    selectedUserIds = [selectedUserIds];
  }

  let promiseList = [];

  // get selected users local/global CSFs
  promiseList.push(rulesDao.usersRules({userIds: selectedUserIds}));

  // adding rules to existing user
  if (userToInheritISRules) {
    // get inheriting user rules
    promiseList.push(rulesDao.getUserRules({userId: userToInheritISRules}));
  }

  return Promise.all(promiseList).then(function (result) {
    let selectedRules = _.chain(result[0]).map(function (selectedRule) {
      return {_id: selectedRule._id};
    }).uniq("_id").filter(function (iSoftRuleId) {
      return !!iSoftRuleId._id;
    }).value();

    let alreadyAssignedRules = [];
    if (result[1]) {
      alreadyAssignedRules = _.chain(result[1]).map(function (assignedRule) {
        return {_id: assignedRule._id};
      }).uniq("_id").filter(function (iSoftRuleId) {
        return !!iSoftRuleId._id;
      }).value();
    }

    console.log("selectedRules length =", selectedRules.length);
    console.log("alreadyAssignedRules length =", alreadyAssignedRules.length);
    // alternative of _.difference(not working with object)
    /*  let iSoftRulesToInherit = selectedRules/!*_.filter(selectedRules, function (selectedRuleId) {
     return !_.difference(alreadyAssignedRules, selectedRuleId);
     })*!/;*/

    let iSoftRulesToInherit = selectedRules.filter(function (selectedRule) {
      return alreadyAssignedRules.filter(function (alreadyAssignedRule) {
          return alreadyAssignedRule._id == selectedRule._id;
        }).length == 0;
    });

    console.log("iSoftRulesToInherit length =", iSoftRulesToInherit.length);
    return {
      iSoftRules: iSoftRulesToInherit,
    };
  });
}

function assignRulesToUser(userToAssignRule, rulesIdsToAssign) {
  console.log("userToAssignRule =", userToAssignRule, ", rulesIdsToAssign =", rulesIdsToAssign);

  let errMsg = [];
  if (!userToAssignRule) {
    errMsg.push("User not provided to add rules.");
  }
  if (!rulesIdsToAssign) {
    errMsg.push("Rules not provided.");
  }

  if (errMsg.length > 0) {
    return Promise.reject(errMsg);
  }
  return rulesDao.assignRulesToUser({userToAssignRule, rulesIdsToAssign});
}

function unAssignISoftRules(filters) {
  return rulesDao.unAssignISoftRules(filters);
}

function getUserRules(filter, options) {
  return rulesDao.getUserRules(filter, options);
}

//========================== Export Module Start ==============================

module.exports = {
  mergeRules, assignRulesToUser, getUserRules, unAssignISoftRules
};

//========================== Export Module End ===============================
