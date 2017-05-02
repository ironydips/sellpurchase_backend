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
  orderInfo.fromDate = appUtil.getCurrentDateString(orderInfo.fromDate);
  orderInfo.endDate = appUtil.getNextDateSting(orderInfo.endDate);

  return orderItemService.getOrderItems(orderInfo, false)
    .then(function(result){
        let productInfo = [];
        let productList = [];


        if(result && result.length > 0){
          result.forEach(function(data){

            let productName = data.brandName + '-' + data.variantName;
            let productIndex = productList.indexOf(productName);

            if(productIndex == -1){
              productList.push(productName);

              productInfo.push({
                name: productName,
                'dayInStock': data.lastStock,
                'dayOutStock': 0,
                'orderItems' : []
              });
            }

            // delete unwanted properties
            delete data.createdBy;
            delete data.profit;
            delete data.avgBuyPrice;

            //set product info
            productInfo[productList.indexOf(productName)].orderItems.push(data);
            productInfo[productList.indexOf(productName)].dayOutStock = data.remainingStock;
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
