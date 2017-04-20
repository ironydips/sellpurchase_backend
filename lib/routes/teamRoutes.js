"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");
const teamRoutr = require("express").Router();

//========================== Load internal modules ====================

// Load company facade
const teamFacade = require('../facade/orderFacade'),
  resHndlr = require('../resHandler'),
  middleware = require("../middleware"),
  constants = require('../constants');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================


teamRoutr.route("/create")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.body, ['name', 'notes', 'managers', 'members', 'memebers', 'companyId']);
      console.log(`filters create company ${JSON.stringify(req.body)}`);
      teamFacade.createTeam(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

teamRoutr.route("/update")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.body, ['name', 'notes', 'managers', 'members', 'memebers', 'companyId', 'teamId']);

      teamFacade.updateTeam(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

teamRoutr.route("/delete")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let filters = _.pick(req.body, ['teamId']);
      teamFacade.deleteTeam(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = teamRoutr;

//========================== Export Module End ===============================
