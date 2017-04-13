"use strict";

//========================== Load Modules Start ===========================

//========================== Load external Module =========================

const _ = require('lodash');

//========================== Load internal Module =========================

const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const exceptions = require("../customExceptions");
const usrService = require("../services/userService");

//========================== Load Modules End =============================

function authorizeRoles(authorizedRoles = []) {
  return function (req, res, next) {
    let userId = req.user._id;
    let roles = req.user.roles;

    let isAuthorized = _.intersection(roles, authorizedRoles).length > 0;

    if (isAuthorized) {
      next();
    } else {
      next(exceptions.unauthorizedAccess("User not authorized to access resources."));
    }
  };
}

function authorizeUserUpdate(authorizedRoles = []) {
  return function (req, res, next) {
    let userId = req.user._id;
    let roles = req.user.roles;

    let isAuthorized = _.intersection(roles, authorizedRoles).length > 0;

    if (isAuthorized) {
      if ((roles.includes("client") && (roles.length == 1) && userId != req.body._id)) {
        next(exceptions.unauthorizedAccess("User not authorized to access resources."));

      }
      next();
    } else {
      next(exceptions.unauthorizedAccess("User not authorized to access resources."));
    }
  };
}

function authorizeInheritCsf(authorizedRoles = []) {
  return function (req, res, next) {
    let userId = req.user._id;
    let roles = req.user.roles;

    let isAuthorized = _.intersection(roles, authorizedRoles).length > 0;

    if (isAuthorized) {
      if ((roles.includes("client") && (roles.length == 1) && userId != req.body._id)) {
        next(exceptions.unauthorizedAccess("User not authorized to access resources."));

      }
      next();
    } else {
      next(exceptions.unauthorizedAccess("User not authorized to access resources."));
    }
  };
}





//========================== Export Module Start ===========================

module.exports = {
  nationalDelete: authorizeRoles,
  nationalListing: authorizeRoles,
  companyListing: authorizeRoles,
  companyTeamListing: authorizeRoles,
  companyManagerListing: authorizeRoles,
  companyUpdate: authorizeRoles,
  addUser: authorizeRoles,
  createCompany: authorizeRoles,
  userUpdate:authorizeUserUpdate,
  deleteUser:authorizeRoles,
  updateMyProfile:authorizeRoles
};

//========================== Export Module End ===========================
