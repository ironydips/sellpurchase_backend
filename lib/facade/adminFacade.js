"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load admin service
const adminService = require('../services/adminService');
//========================== Load Modules End ==============================================
function addBrand(brandDetails) {
    return adminService.addBrand(brandDetails);
}

//==========================Private Method End=============================

//========================== Export Module Start ==============================

module.exports = {
    addBrand,
    addVariantUnderBrand : adminService.addVariantUnderBrand,
    getBrandInfo : adminService.getBrandInfo
};

//========================== Export Module End ===============================
