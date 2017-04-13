"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

var Promise = require("bluebird");
const _ = require("lodash");

//========================== Load internal modules ====================

// Load user service
const usrService = require('../services/userService');
//Load JWt Service
const jwtHandler = require('../jwtHandler');
var exceptions = require("../customExceptions");
const constants = require('../constants');


//========================== Load Modules End ==============================================

/**
 * @function login
 * login via email
 * @param {Object} loginInfo login details
 */
function loginWithPassword(email, password) {
  return usrService.login(email, password)
    .bind({})
    .then(function (user) {
      if (user == null) {
        throw exceptions.emailPasswordIncorect();
      }
      this.user = user;
      return jwtHandler.genJWTToken({_id: user._id, roles: user.roles});
    }).then(function (jwtToken) {
      usrService.addTokenToUser(jwtToken, this.user);
      return {token: jwtToken, user: this.user};
    });
}

/**
 * @function login
 * login via email
 * @param {Object} loginInfo login details
 */
/*function enrollmentConfermation(token) {
  console.log("token for email verification is : ", token);
  return usrService.(email, password)
    .bind({})
    .then(function (user) {
      if (user == null) {
        // ToDo Email pass not match
        throw exceptions.userNotFound();
      }
      this.user = user;
      return jwtHandler.genJWTToken({_id: user._id});
    }).then(function (jwtToken) {
      usrService.addTokenToUser(jwtToken, this.user);
      return {token: jwtToken, user: this.user};
    });
}*/

function logout(id, token) {
  return usrService.logout(id, token);
}

function resetPassword({password = "", token = ""}) {
  return usrService.resetNewPassword({password, token})
    .then(function (result) {
      if (result) {
        return constants.MESSAGES.PassChanged;
      }
      else {
        throw exceptions.resetTokenExpired();
      }
    });
}

function enrollUser(token) {
  return usrService.enrollUser(token);
}

//========================== Export Module Start ===========================

module.exports = {
  loginWithPassword,
  logout,
  enrollUser,
  resetPassword
};

//========================== Export module end ==================================
