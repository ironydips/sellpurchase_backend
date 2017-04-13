"use strict";

//========================== Load Modules Start =======================
const adminRouter = require("express").Router(),
    _ = require('lodash'),
    Promise = require('bluebird');

//========================== Load internal modules ====================

// Load admin facade
const adminFacade = require('../facade/adminFacade'),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    validators = require("../middleware/validators"),
    constants = require('../constants');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

const pageSort = ['pageSize', 'pageNo', 'sortBy', 'sortOrder'];

adminRouter.route("/addBrand")
    .post([],
        function (req, res) {
            let brandData = _.pick(req.body, ['brandName']);
            adminFacade.addBrand(brandData)
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

adminRouter.route("/addVariantUnderBrand")
    .post([],
        function (req, res) {
            let brandInfo = _.pick(req.body, ['brandName', 'variantName']);

            adminFacade.addVariantUnderBrand(brandInfo)
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


adminRouter.route("/getBrandInfo")
    .get([],
        function (req, res) {
            adminFacade.getBrandInfo()
                .then(function (result) {
                    resHndlr.sendSuccessWithMsg(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

adminRouter.route("/dropCollection")
    .get([],
            function (req,res) {
                adminFacade.dropCollection()
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

module.exports = adminRouter;

//========================== Export Module End ===============================
