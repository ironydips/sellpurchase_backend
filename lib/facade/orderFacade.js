"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');
const Promise = require('bluebird');

//========================== Load internal modules ====================
// Load admin service
const adminService = require('../services/adminService');

// Load stock service
const purchaseOrderService = require('../services/purchaseOrderService');
//========================== Load Modules End ==============================================

function getAllOrders(filter) {
    return Promise.all([
        getPuchaseOrders(filter),
        // TODO: getSellOrders(),
        // getOrderItems()
    ])
}

//==========================Private Method End================================

function getPuchaseOrders(filter) {

    return purchaseOrderService.getAllOrders(filter)
}

//========================== Export Module Start ==============================

module.exports = {
    getAllOrders
};

//========================== Export Module End ===============================
