"use strict";

//========================== Load Modules Start ===========================

//========================== Load external Module =========================

const _ = require('lodash');

//========================== Load internal Module =========================

const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const exceptions = require("../customExceptions");
const usrService = require('../services/userService');

//========================== Load Modules End =============================

function autntctTkn(req, res, next) {
  const acsToken = req.get('Authorization');

  console.log(`acsToken ${acsToken}`);
  return jwtHandler.verifyUsrToken(acsToken)
    .then(function (tokenPayload) {
      req.user = tokenPayload;
      return usrService.getUserById(req.user._id);
    }).then(function (user) {
      if (!user) {
        throw exceptions.unAuthenticatedAccess("User not valid.");
      }

      let isValidToken = false;
      _.forEach(user.services.resume.loginTokens, function (token) {
        if (token.hashedToken === acsToken) {
          isValidToken = true;
          return false;
        }
      });

      if (isValidToken) {
        next();
      } else {
        throw exceptions.unAuthenticatedAccess("User logged out already. Please login again.");
      }
    }).catch(function (err) {
      next(err);
    });
}

//========================== Export Module Start ===========================

module.exports = {
  autntctTkn
};

//========================== Export Module End ===========================
