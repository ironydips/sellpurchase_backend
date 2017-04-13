"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");


//========================== Load internal modules ====================

const config = require('../lib/config/env');

//========================== Load Modules End ==============================================

const smtpConfig = config.mailConfig;
const transporter = nodemailer.createTransport(smtpTransport({
  host : smtpConfig.hostname,
  secureConnection : false,
  port: smtpConfig.port,
  auth : {
    user : smtpConfig.domainLogin,
    pass : smtpConfig.domainPassword
  }
}));

function sendMail(options) {
  return transporter.sendMail(options, function (err, info) {
    console.log("err =", err);
    console.log("info =", info);
  });
}

//========================== Export Module Start ===========================

module.exports = {
  sendMail
};

//========================== Export module end ==================================
