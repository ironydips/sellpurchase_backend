/**
 * Created by nitish on 29/12/16.
 */
"use strict";

//========================== Load Modules Start ===========================
const _ = require('lodash');

//========================== Load internal Module =========================
const exceptions = require("../customExceptions"),
  usrFacade = require('../facade/userFacade');

//========================== Load Modules End =============================

function onBeforeAction(req, res, next) {
  let belongsToChief = req.user.isChief;
  let roles = req.user.roles;
  let allowedRoutes = [
    'member', 'reports',
    'leaderboard', 'companies/details', 'users'
  ];

  let routeName = _.slice(_.split(req.baseUrl,'/'),4).join(',');

  if (!belongsToChief && !hasRoles(roles, 'manager') && allowedRoutes.indexOf(routeName) == -1) {
    throw new exceptions.getCustomErrorException('Permission Denied');
  }
  else{
    next();
  }
}

function verifyCompanyAccess(req, res, next) {
  let userId = req.user._id;
  let roles = req.user.roles;

  return isChiefUser(userId)
    .then(function (isChief) {
      req.user.isChief = isChief;
      if(!isChief) {
        if(isAdmin(roles)) {
          next();
        }
        else {
          throw new exceptions.getCustomErrorException('Permission Denied');
        }
      }
      else{
        next();
      }
    })
    .catch(function (err) {
      next(err);
    });
}

//===========================Private Method Start==========================

function isChiefUser(userId) {
  return usrFacade.isChiefUser(userId)
    .then(function (result) {
      return result;
    });
}

function isAdmin(roles) {
  return hasRoles(roles, 'admin,su');
}

function hasRoles(roles, names) {
  let hasRole = false;
  names = _.split(names, ',');

  if (roles.length) {
    for (let i = names.length - 1; i >= 0; i--) {
      if (roles.indexOf(names[i]) > -1) hasRole = true;
    }
  }
  return hasRole;
}

//===========================Private Method End==========================
//========================== Export Module Start ===========================

module.exports = {
  verifyCompanyAccess,
  verifyNationalAccess : verifyCompanyAccess,
  onBeforeAction
};

//========================== Export Module End ===========================
