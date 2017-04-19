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

purchaseRouter.route('/addPurchaser')
    .post([],
        function (req,res) {
            let purhcaserInfo = _.pick(req.body, ['name', 'address', 'number1', 'number2', 'notes']);

            purchaseFacade.addPurchaser(purhcaserInfo)
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        }
    );

purchaseRouter.route("/getPurchasingRelatedInfo")
    .get([],
        function (req, res) {
            Promise.all([getPurchasersDetails(),getWarehouseItems()])
                .then(function (allData) {
                    let result = {};
                    result.purchaserInfo = allData[0];
                    result.warehouseItems = allData[1];

                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

//========================== Define Routes End ==============================================

//===========================Private Methods Start===========================================

function getPurchasersDetails() {
    return purchaseFacade.getPurchasersDetails();
}

function getWarehouseItems() {
    return purchaseFacade.getWarehouseItems();
}

//===========================Private Methods End==============================================


//========================== Export Module Start ==============================

module.exports = purchaseRouter;

//========================== Export Module End ===============================
