"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load purchaser dao
const purchaserDao = require("../dao/purchaseDao");
const _ = require("lodash");

let purchasersDetails = {};

//========================== Load Modules End ==============================================

function getPurchasersDetails() {
    return purchaserDao.getPurchasersDetails()
        .then(function (result) {
            purchasersDetails = result;
            return result;
        });
}

function getCachePurchaserInfo() {
    return purchasersDetails;
}

//========================== Export Module Start ==============================

module.exports = {
    savePurchaser: purchaserDao.savePurchaser,
    addPurchaser: purchaserDao.addPurchaser,
    getPurchasersDetails,
    getCachePurchaserInfo
};

//========================== Export Module End ===============================
