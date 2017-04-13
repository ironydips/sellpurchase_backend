"use strict";

//========================== Load Modules Start =======================
const leaderboardRoutr = require("express").Router();

//========================== Load internal modules ====================
// Load log facade
const leaderFacade = require('../facade/leaderfacade');
const resHndlr = require('../resHandler');
const middleware = require("../middleware"),
  _ = require('lodash'),
  Promise = require('bluebird');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

// route for leaderboard listing
leaderboardRoutr.route("/list")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['search', 'companyId']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);

      console.log(`filters ${filters}, options ${options}`);

      leaderFacade.listLeaders(filters, options)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

leaderboardRoutr.route("/remove")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let leaderBoradId = req.body.leaderBoradId;
      return leaderFacade.removelBoard(leaderBoradId)
        .then(function (data) {
          resHndlr.sendSuccessWithMsg(res, "LeaderBoard deleted successfully");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


leaderboardRoutr.route("/detail")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let leaderBoradId = req.body.leaderBoradId;
      return leaderFacade.lBoardDetail(leaderBoradId)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


leaderboardRoutr.route("/add")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])], middleware.validators.validateLBAdd,
    function (req, res) {
      let lbData =  _.pick(req.body, ['name', 'showLeaders', 'leaderCount', 'categories', 'factorsFilter', 'period', 'company'
        , 'team', 'breakLevel', 'order', 'frequency', 'time', 'day', 'month', 'date', 'receivers', 'others' ,'from' ,'to']);
      lbData.loggedInUserId = req.user._id;
      return leaderFacade.addLeaderBoard(lbData)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


leaderboardRoutr.route("/update")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let updateLbData = _.pick(req.body, ['id', 'data']);

      updateLbData.loggedInUserId = req.user._id;
      /**
       * check if loggedin user is chief company || admin || su
       *
       */
      return leaderFacade.updateLeaderBoard(updateLbData)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


module.exports = leaderboardRoutr;




