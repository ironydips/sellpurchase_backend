"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load purchase service
const purchaseService = require('../services/purchaseService');

// Load common service
const commonService = require('../services/commonService')

//========================== Load Modules End ==============================================
function placeOrder(orderDetails) {

    getPurchaserID(orderDetails.purchaser)
        .then(function (purchaserID) {
            saveItems(orderDetails.items, puchaserID)
                .then(function (result) {

                })
        });

    return adminService.addBrand(orderDetails);
}

function getWarehouseItems() {
    return commonService.getWarehouseItems()
        .then(function (result) {
            if(result) {
                result.forEach(function (data) {
                    data._doc.productInfo = data.brandName + '-' + data.variantName;
                });
            }
            return result;
        });
}

//==========================Private Method End==================================

function getPurchaserID(purchaserInfo) {
    if(purchaserInfo.id == 0) { // New Purchaser
        return purchaseService.savePurchaser(purchaserInfo)
                    .then(function (result) {
                        return result._id;
                    });
    }
    else{
        return Promise.resolve(purchaserInfo.id);
    }
}


//========================== Export Module Start ==============================

module.exports = {
    placeOrder,
    getWarehouseItems,
    getPurchasersDetails: purchaseService.getPurchasersDetails
};

//========================== Export Module End ===============================