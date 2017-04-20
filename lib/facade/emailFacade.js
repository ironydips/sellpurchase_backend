"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

const exceptions = require("../customExceptions");
const userService = require("../services/userService");
const emailService = require("../services/orderItemService");
const constants = require('../constants');


//========================== Load Modules End ==============================================


function sendErrorEmail(msgs = [], params = {}) {
  let msg = "";
  for (var i = 0; i < msgs.length; i++) {
    msg = msg + msgs[i];

    if (i < msgs.length - 1) {
      msg = msg + ", ";
    }
  }
  return emailService.sendErrorEmail(msg, params);
}

function forgotPassword({email = ""}) {
  return userService.resetPassword({email})
    .then(function (userUpdateRslt) {
      if (userUpdateRslt) {
        // user found and updated send mail
        emailService.sendResetPwdMail({
          token: userUpdateRslt.services.password.reset.token, email,
          profile: `${userUpdateRslt.profile.firstName}${userUpdateRslt.profile.lastName ? " " + userUpdateRslt.profile.lastName : ""}`
        });
        return {message: constants.MESSAGES.emailSent};
      } else {
        // throw error
        throw exceptions.userNotFound();
      }
    });
}


function resendVerifyMail(filters = {}) {
  return userService.userDetail(filters)
    .then(function (result) {
      //console.log(result);
      let user = result;
      if (user) {
        return userService.resetPassword({email: user.emails[0].address})
          .then(function (result) {
            emailService.sendUserCreationEmail({
              email: user.emails[0].address,
              profile: user.profile.firstName,
              token: result.services.password.reset.token
            });

            return {message: constants.MESSAGES.emailSent};
          });
      }
      else {
        // throw error
        throw exceptions.userNotFound();

      }
    });


}

//========================== Export Module Start ==============================

module.exports = {sendErrorEmail, forgotPassword, resendVerifyMail};

//========================== Export Module End ===============================
