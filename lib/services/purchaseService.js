"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load purchaser dao
const purchaserDao = require("../dao/purchaseDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================

//========================== Export Module Start ==============================

module.exports = {
    savePurchaser: purchaserDao.savePurchaser,
    addPurchaser: purchaserDao.addPurchaser,
    getPurchasersDetails: purchaserDao.getPurchasersDetails
};

//========================== Export Module End ===============================
