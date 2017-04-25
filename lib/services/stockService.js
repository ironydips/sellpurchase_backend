"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load stock dao
const stockDao = require("../dao/stockDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================


//========================== Export Module Start ==============================

module.exports = {
    addStock: stockDao.addStock,
    updateStockInfo: stockDao.updateStockInfo,
    getStockInfo: stockDao.getStockInfo
};

//========================== Export Module End ===============================
