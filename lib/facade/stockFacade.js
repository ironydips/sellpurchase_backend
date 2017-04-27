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

function getStockInfo(orderInfo){
  orderInfo.fromDate = orderInfo.fromDate || appUtil.getCurrentDateString();
  orderInfo.endDate = orderInfo.endDate || appUtil.getNextDateSting();

  return orderItemService.getOrderItems(orderInfo, false)
    .then(function(result){
        let productInfo = {};

        if(result && result.length > 0){
          result.forEach(function(data){

            let productName = data.brandName + '-' + data.variantName;

            //initialize product
            if(!productInfo[productName]){
              productInfo[productName] = {
                'dayInStock': data.lastStock,
                'dayOutStock': 0,
                orderItems: []
              };
            }

            // delete unwanted properties
            delete data.createdBy;
            delete data.profit;
            delete data.avgBuyPrice;

            //set product info
            productInfo[productName].orderItems.push(data);
            productInfo[productName].dayOutStock = data.remainingStock;
          });
        }

        return productInfo;
    });
}


//==========================Private Method End================================


//========================== Export Module Start ==============================

module.exports = {
    getStockInfo,
    getStockHistory
};

//========================== Export Module End ===============================
