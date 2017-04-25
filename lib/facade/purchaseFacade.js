"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load purchase service
const purchaseService = require('../services/purchaseService');

// Load common service
const commonService = require('../services/commonService');

// Load purchase order service
const purchaseOrderService = require('../services/purchaseOrderService');

// Load order item service
const orderItemService = require('../services/orderItemService');

// Load stock service
const stockService = require('../services/stockService');

// Load payment service
const paymentService = require('../services/paymentService');

//App Constants
const appConstants = require('../constants');

//========================== Load Modules End ==============================================
function placeOrder(orderDetails) {

    let mappedOrder = mapOrderInfo(orderDetails);

    return purchaseOrderService.addPurchaserOrder(mappedOrder)
        .then(function (result) {
            let orderID = result._doc._id.toString();
            let items = orderDetails.Items;

            //TODO: add date parameter as well.
            return Promise.all([
                                    addOrderItems(items, orderID, orderDetails.purchaser.id),
                                    updateStockInfo(items),
                                    updatePayments(orderDetails.payment, orderDetails.purchaser.id)
                                ])
                .then(function (result) {
                    return result.filter(function (data) {
                        return data != null;
                    });
                });
        });
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

function mapOrderInfo(order) {
    let mappedOrder = {};

    mappedOrder.purchaserName = order.purchaser.name;
    mappedOrder.purchaserID = order.purchaser.id;
    mappedOrder.totalItems = order.Items ? order.Items.length : 0;
    mappedOrder.previousBalance = order.payment.previousBalance;
    mappedOrder.totalAmount = order.payment.totalAmount;
    mappedOrder.amountPaid = order.payment.amountPaid;
    mappedOrder.currentBalance = order.payment.currentBalance;
    mappedOrder.isReturned = order.isReturned;
    mappedOrder.refID = order.refID ? order.refID : 0;
    mappedOrder.paidBy = [];
    mappedOrder.paidBy.push({name: 'Shop', amount: order.payment.paidByShop});
    mappedOrder.paidBy.push({name: 'Bharat', amount: order.payment.paidByBharat});
    mappedOrder.paidBy.push({name: 'Prateek', amount: order.payment.paidByPrateek});

    return mappedOrder;
}

function addOrderItems(items, orderID, purchaserID) {
    if(items && items.length > 0){
        return orderItemService.addOrderItems(items, orderID, true, purchaserID);
    }
    else{
        return Promise.resolve(orderID);
    }
}

function updateStockInfo(items) {
    if(items && items.length > 0) {
        let stockList = [];

        items.forEach(function (item) {
            let availableQty = item.availableQty ? item.availableQty : 0;

            stockList.push({
                brandName: item.brandName,
                variantName: item.variantName,
                avgBuyPrice: (((availableQty * item.avgBuyPrice) + (item.quantity * item.price)) / (availableQty + item.quantity)).toFixed(2),
                availableQty: item.quantity + availableQty
            });
        });

        return stockService.updateStockInfo(stockList);
    }
    else{
        return Promise.resolve(null);
    }
}

function updatePayments(payment, purchaserID) {
    let promiseArray = [];
    let bharatPayment = payment.paidByBharat ? parseFloat(payment.paidByBharat) : 0;
    let prateekPayment = payment.paidByPrateek ? parseFloat(payment.paidByPrateek) : 0;

    // Update Bharat's balance
    if(bharatPayment != 0){
        let purchaser = {name: appConstants.USERS.BHARAT_UNCLE, id: 0};
        promiseArray.push(paymentService.updateBalance(bharatPayment, purchaser, true));
    }

    // Update Prateek's balance
    if(prateekPayment != 0){
        let purchaser = {name: appConstants.USERS.PRATEEK, id: 0};
        promiseArray.push(paymentService.updateBalance(prateekPayment, purchaser, true));
    }

    // Update Purchaser's balance
    if(payment.totalAmount != payment.amountPaid){
        let purchaser = {name: String.EMPTY, id: purchaserID};
        promiseArray.push(paymentService.updateBalance((payment.totalAmount - payment.amountPaid), purchaser, true));
    }

    return Promise.all(promiseArray);
}

//========================== Export Module Start ===============================

module.exports = {
    placeOrder,
    getWarehouseItems,
    addPurchaser:purchaseService.addPurchaser,
    getPurchasersDetails: purchaseService.getPurchasersDetails
};

//========================== Export Module End ===============================