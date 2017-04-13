"use strict";

//========================== Load Modules Start =======================

const _ = require('lodash');
const reportRoutr = require("express").Router();

//========================== Load internal modules ====================

const resHndlr = require('../resHandler');
const middleware = require("../middleware");
const reportFacade = require('../facade/reportFacade');


//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

reportRoutr.route("/detail")
  .get([middleware.authentication.autntctTkn], function (req, res) {
    let filters = _.pick(req.query, ['reportId']);

    reportFacade.reportDetail(filters)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

reportRoutr.route("/generate")
  .post(/*[middleware.authentication.autntctTkn],*/ function (req, res) {
    // user filers
    let filters = _.pick(req.body, ['companiesIds', 'teamsIds', 'usersIds', 'categoriesIds',
      'period', 'from', 'to', 'periodDays', 'factorsIds', 'pointsIds']);
    //includeManagersStats - include manager stats for selected team, user else for selected company
    let options = _.pick(req.body, ['level', 'viewMode', 'sortBy', 'includeManagersStats']);
    filters.user = req.user;

    reportFacade.generateReport(filters, options)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = reportRoutr;

//========================== Export Module End ===============================
