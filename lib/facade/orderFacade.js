"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load order item service
const orderItemService = require('../services/orderItemService');

// Load purchase order service
const purchaseOrderService = require('../services/purchaseOrderService');
//========================== Load Modules End ==============================================

function getAllOrders(filter) {
    return Promise.all([
        getPuchaseOrders(filter)
        // TODO: getSellOrders(),
    ])
}

function getOrderDetails(order) {
    return getOrder(order);
}

//==========================Private Method End================================

function getPuchaseOrders(filter) {
    return purchaseOrderService.getAllOrders(filter)
}

function getOrderItems(order) {
    return orderItemService.getOrderItems(order, true);
}

function getOrder(order) {
    if(order.isPurchaser) {
        return purchaseOrderService.getFullOrderDetails(order.orderID);
    }
    else{
        //TODO:
        return Promise.resolve(null);
    }
}

//========================== Export Module Start ==============================

module.exports = {
    getAllOrders,
    getOrderDetails
};

//========================== Export Module End ===============================
