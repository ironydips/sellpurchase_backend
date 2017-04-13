"use strict";

//========================== Load Modules Start =======================

const _ = require('lodash');
const emlRoutr = require("express").Router();

//========================== Load internal modules ====================

const resHndlr = require('../resHandler');
const middleware = require("../middleware");
// Load email facade
const emailFacade = require("../facade/emailFacade");

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================


// route for resending  account created mail
emlRoutr.route("/resendemail")
  .post([middleware.authentication.autntctTkn,middleware.authorization.companyListing(["admin", "su"])], function (req, res) {

    let filters = _.pick(req.body, ['_id']);
    // console.log(filters);

    emailFacade.resendVerifyMail(filters)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });

  });


//========================== Define Routes End ===============================

//========================== Export Module Start =============================

module.exports = emlRoutr;

//========================== Export Module End ===============================
