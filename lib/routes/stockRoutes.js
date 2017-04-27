"use strict";

//========================== Load Modules Start =======================
const stockRouter = require("express").Router(),
    _ = require('lodash'),
    Promise = require('bluebird');

//========================== Load internal modules ====================

// Load stock facade
const stockFacade = require('../facade/stockFacade'),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    validators = require("../middleware/validators"),
    constants = require('../constants');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

const pageSort = ['pageSize', 'pageNo', 'sortBy', 'sortOrder'];

stockRouter.route("/getCurrentStockInfo")
    .get([],
        function (req,res) {
            let orderInfo = _.pick(req.query, ['fromDate', 'endDate']);

            stockFacade.getStockInfo(orderInfo)
                .then(function (result) {
                    debugger;
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

stockRouter.route("/getStockHistory")
    .get([],
        function (req,res) {
            let productInfo = _.pick(req.query, ['brandName', 'variantName']);

            stockFacade.getStockHistory(productInfo)
                .then(function (result) {
                    debugger;
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

module.exports = stockRouter;

//========================== Export Module End ===============================
