"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load purchaser order dao
const purchaserOrderDao = require("../dao/purchaseOrderDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================

function getAllOrders(filter) {
    return purchaserOrderDao.getAllOrders(filter)
        .then(function (result) {
            let purchaserCollection = [];
            if(result && result.length > 0){
                result.forEach(function (data) {
                    let purchaserDetail = {};

                    purchaserDetail.orderID = data._id;
                    purchaserDetail.isPurchaser = true;
                    purchaserDetail.name = data.purchaserName || 'Dummy';
                    purchaserDetail.purchaserID = data.purchaserID;
                    purchaserDetail.billAmount = data.totalAmount - data.previousBalance;
                    purchaserDetail.amountPaid = data.amountPaid;
                    purchaserDetail.previousBalance = data.previousBalance;
                    purchaserDetail.isReturned = data.isReturned;
                    purchaserDetail.date = data.createdOn;

                    purchaserCollection.push(purchaserDetail);
                });
            }

            return purchaserCollection;
        });
}

//========================== Export Module Start ==============================

module.exports = {
    addPurchaserOrder: purchaserOrderDao.addPurchaserOrder,
    getAllOrders
};

//========================== Export Module End ===============================
