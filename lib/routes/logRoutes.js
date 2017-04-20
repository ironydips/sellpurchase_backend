/**
 * Created by madhukar on 2/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

const logRoutr = require("express").Router();

//========================== Load internal modules ====================
// Load log facade
const logFacade = require('../facade/purchaserOrderFacade');
const resHndlr = require('../resHandler');
const middleware = require("../middleware"),
  _ = require('lodash'),
  Promise = require('bluebird');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

// route for Audit Log
logRoutr.route("/logs")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
    let filters = _.pick(req.query, ['search', 'companyId']);
    let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);

    filters.log = req.log;
    console.log(`filters ${filters}, options ${options}`);

    logFacade.listLogs(filters, options)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });


module.exports = logRoutr;
