"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================

// Load stock service
const stockService = require('../services/stockService');

// Load order item service
const orderItemService = require('../services/orderItemService');

const appUtil = require('../appUtils');

//========================== Load Modules End ==============================================

function getStockHistory(productInfo) {
  productInfo.fromDate = productInfo.fromDate || appUtil.getCurrentDateString();
  productInfo.endDate = productInfo.endDate || appUtil.getNextDateSting();

  debugger;
  return orderItemService.getOrderItems(productInfo);
}


//==========================Private Method End================================


//========================== Export Module Start ==============================

module.exports = {
    getStockInfo: stockService.getStockInfo,
    getStockHistory
};

//========================== Export Module End ===============================
