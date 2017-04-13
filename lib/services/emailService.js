"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


var urlencode = require('urlencode');
//========================== Load internal modules ====================

const appUtils = require('../appUtils');
const appConst = require('../constants');
const emailHandler = require('../emailHandler');


//========================== Load Modules End ==============================================

function sendResetPwdMail({token, email, profile}) {
  let resetPasswordLink = appUtils.getResetPasswordLink(urlencode(token));

  let options = {
    to: email,
    // bcc: Accounts.emailTemplates.resetPassword.bcc,
    from: `Southwestern Consulting<noreply@southwesternconsulting.com>`,
    subject: appConst.MESSAGES.resetPasswordEmail.subject.replace("#domain", appUtils.getWebUrl())
  };

  options.text = appConst.MESSAGES.resetPasswordEmail.body
    .replace("#userName", profile ? ` ${profile}` : "")
    .replace("#resetPasswordLink", resetPasswordLink);

  if (appUtils.isProdEnv() || appUtils.isTestUsers(options.to)) {
    return emailHandler.sendMail(options);
  }
}

function sendErrorEmail(msg, params) {
  let options = {
    to: "swccoaching@southwesternconsulting.com",
    // bcc: [Accounts.emailTemplates.resetPassword.bcc],
    cc: ["sw@algointra.com"],
    from: `Southwestern Consulting<noreply@southwesternconsulting.com>`,
    subject: appConst.MESSAGES.errorEmail.subject
  };

  options.html = appConst.MESSAGES.errorEmail.body
    .replace("#mailTitle", "South Western Consulting")
    .replace("#mailContentTitle", "Hi ED!")
    .replace("#mailContent", JSON.stringify({msg, params}));

  if (appUtils.isProdEnv() || appUtils.isTestUsers(options.to)) {
    return emailHandler.sendMail(options);
  }
}

function sendUserCreationEmail({token, email, profile}) {
  let userCreateUrl = appUtils.getUserEnrollLink(urlencode(token));
  console.log("userCreateUrl", userCreateUrl);

  let options = {
    to: email,
    // bcc: Accounts.emailTemplates.resetPassword.bcc,
    from: `Southwestern Consulting<noreply@southwesternconsulting.com>`,
    subject: appConst.MESSAGES.accountCreateEmail.subject.replace("#domain", `${appUtils.getWebUrl()}`)
  };
  let body = appConst.MESSAGES.accountCreateEmail.body
    .replace("#name", profile ? `Welcome ${profile}!` : "")
    .replace("#msg", "An account has been created for you at our Critical Success Factors website. Activate your account to get started:")
    .replace("#btntxt", "Activate Now");
  options.html = appUtils.replaceAll(body, "#userCreateUrl", userCreateUrl);

  if (appUtils.isProdEnv() || appUtils.isTestUsers(options.to)) {
    return emailHandler.sendMail(options);
  }
}

//========================== Export Module Start ===========================

module.exports = {
  sendResetPwdMail, sendErrorEmail, sendUserCreationEmail
};

//========================== Export module end ==================================
