"use strict";

//========================== Load Modules Start =======================
const nationalRoutr = require("express").Router(),
  _ = require('lodash');

//========================== Load internal modules ====================

// Load national facade
const nationalFacade = require('../facade/nationalFacade'),
  resHndlr = require('../resHandler'),
  appUtils = require('../appUtils'),
  constants = require("../constants"),
  validators = require("../middleware/validators"),
  middleware = require("../middleware");

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

nationalRoutr.route("/")
  .get([middleware.authentication.autntctTkn, middleware.authorization.nationalListing(["su", "admin", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['search']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);

      nationalFacade.getNationals(filters, options)
        .then(function (nationalList) {
          resHndlr.sendSuccess(res, nationalList);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

nationalRoutr.route("/delete")
  .post([middleware.authentication.autntctTkn, middleware.authorization.nationalDelete(["su", "admin"])],
    function (req, res) {
      let filters = _.pick(req.body, ['_id']);
      filters.user = req.user;

      nationalFacade.deleteNational(filters)
        .then(function (result) {
          console.log(`delete national result ${JSON.stringify(result)}`);
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

nationalRoutr.route('/new')
  .post([
      middleware.authentication.autntctTkn,
      middleware.authorization.nationalDelete(["su", "admin"]),
      validators.createNational
    ],
    function (req, res) {
      console.log("national create req = ", JSON.stringify(req.body));
      let nationalDetails = _.pick(req.body, ['name', 'address', 'city', 'state',
        'zip', 'country', 'phone', 'email', 'notes']);
      console.log("nationalDetails = ", JSON.stringify(nationalDetails));

      nationalFacade.addNational(nationalDetails)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * return national company detail
 */
nationalRoutr.route("/detail")
  .get([middleware.authentication.autntctTkn, middleware.authorization.nationalListing(["su", "admin", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['_id']);
      return nationalFacade.getNational({nationalId: filters._id})
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * update national
 */
nationalRoutr.route("/update")
  .post([
    middleware.authentication.autntctTkn,
    middleware.authorization.nationalListing(["su", "admin", "coach"]),
    middleware.validators.updateNational
  ], function (req, res) {
    let nationalDetails = _.pick(req.body, ['_id', 'name', 'address', 'city', 'state',
      'zip', 'country', 'phone', 'email', 'notes',]);
    return nationalFacade.updateNational(nationalDetails)
      .then(function (result) {
        resHndlr.sendSuccessWithMsg(res, result);

      }).catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

//========================== Define Routes End ==============================================

//========================== Export Module Start ==============================

module.exports = nationalRoutr;

//========================== Export Module End ===============================

//===========================Private Methods Start===========================================

//===========================Private Methods End==============================================
