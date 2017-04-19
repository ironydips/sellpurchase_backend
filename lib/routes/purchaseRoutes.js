"use strict";

//========================== Load Modules Start =======================
const purchaseRouter = require("express").Router(),
    _ = require('lodash'),
    Promise = require('bluebird');

//========================== Load internal modules ====================

// Load purchase facade
const purchaseFacade = require('../facade/purchaseFacade'),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    validators = require("../middleware/validators"),
    constants = require('../constants');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

purchaseRouter.route("/placeOrder")
    .post([],
        function (req, res) {
            let orderDetails = _.pick(req.body, ['orderDetails']);

            purchaseFacade.placeOrder(orderDetails)
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

purchaseRouter.route("/getWarehouseItems")
    .get([],
        function (req, res) {
            purchaseFacade.getWarehouseItems()
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

purchaseRouter.route("/getPurchasersDetails")
    .get([],
        function (req, res) {
            purchaseFacade.getPurchasersDetails()
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

//========================== Define Routes End ==============================================

//===========================Private Methods Start===========================================

//===========================Private Methods End==============================================


//========================== Export Module Start ==============================

module.exports = purchaseRouter;

//========================== Export Module End ===============================
