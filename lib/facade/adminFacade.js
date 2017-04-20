"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load admin service
const adminService = require('../services/adminService');

// Load stock service
const stockService = require('../services/stockService');
//========================== Load Modules End ==============================================
function addBrand(brandDetails) {
    return adminService.addBrand(brandDetails);
}

function addVariantUnderBrand(brandInfo) {
    return Promise.all([addToBrand(brandInfo), addToStock(brandInfo)]);
}

//==========================Private Method End================================

function addToBrand(brandInfo) {
    return adminService.addVariantUnderBrand(brandInfo);
}

function addToStock(brandInfo) {
    return stockService.addStock(brandInfo);
}

//========================== Export Module Start ==============================

module.exports = {
    initScript: adminService.initScript,
    dropCollection : adminService.dropCollection,
    addBrand,
    addVariantUnderBrand,
    getBrandInfo : adminService.getBrandInfo
};

//========================== Export Module End ===============================
