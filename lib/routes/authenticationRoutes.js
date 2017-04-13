"use strict";

//========================== Load Modules Start =======================
const authenticationRoutr = require("express").Router();
var urlencode = require('urlencode');


//========================== Load internal modules ====================

const authFacade = require("../facade/authFacade");
const Accounts = require("../facade/emailFacade");
const resHndlr = require('../resHandler');
const middleware = require("../middleware");
const constants = require('../constants');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

/**
 * login with email
 */
authenticationRoutr.route("/login")
  .post([middleware.validators.validateLogin], function (req, res) {
    let email = req.body.email.trim(),
      password = req.body.password.trim();

    authFacade.loginWithPassword(email, password)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

// logout Api
authenticationRoutr.route("/logout")
  .post([middleware.authentication.autntctTkn], function (req, res) {
    let id = req.user._id;
    let token = req.get('Authorization');
    authFacade.logout(id, token)
      .then(function (result) {
        resHndlr.sendSuccessWithMsg(res, constants.MESSAGES.successfullySignedout);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

authenticationRoutr.route("/enroll/:token")
  .get(function (req, res) {
    let token = urlencode.decode(req.params.token);
    authFacade.enrollUser(token)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

authenticationRoutr.route("/forgotPassword")
  .post([middleware.validators.validateForgotPass], function (req, res) {
    let email = req.body.email.trim();
    Accounts.forgotPassword({email})
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

authenticationRoutr.route("/resetPassword")
  .post([middleware.validators.validateResetPass], function (req, res) {
    let password = req.body.password.trim();
    let token = urlencode.decode(req.body.token.trim());
    authFacade.resetPassword({password, token})
      .then(function (result) {
        resHndlr.sendSuccessWithMsg(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });
//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = authenticationRoutr;

//========================== Export Module End ===============================
