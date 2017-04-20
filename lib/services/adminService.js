"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load company dao
const adminDao = require("../dao/adminDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================

function addBrand(brandDetails) {
    return adminDao.addBrand(brandDetails);
}
//========================== Export Module Start ==============================

module.exports = {
    initScript: adminDao.initScript,
    dropCollection : adminDao.dropCollection,
    addBrand,
    addVariantUnderBrand: adminDao.addVariantUnderBrand,
    getBrandInfo : adminDao.getBrandInfo
};

//========================== Export Module End ===============================
