"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash'),
    mongoose = require('mongoose');

//========================== Load internal modules ====================

const PurchaseOrders = require('../model/PurchaseOrders'),
    BaseDao = new require('../dao/baseDao'),
    purchaseOrderDao = new BaseDao(PurchaseOrders),
    appUtils = require('../appUtils'),
    appConstants = require('../constants');


//========================== Load Modules End ==============================================

const SORT_BY = {
    name: 'profile.name',
    email: 'profile.email',
    country: 'profile.country',
    city: 'profile.city',
    address: 'profile.address',
    teamName: 'teams.profile.name'
};

//Define Projections
const PROJECTION = {
    ALL: {},
    BASIC_INFO: {
        paidBy: 0, createdBy: 0
    },
    COMPANY_DETAIL: {_id: 1, profile: 1, national: 1, salesId: 1, disabled: 1},
    ID: {_id: 1}
};

//=============================Define Methods Start=================================================

function addPurchaserOrder(orderInfo) {
    let newOrder = {};

    newOrder.purchaserID = orderInfo.purchaserID;
    newOrder.totalItems = orderInfo.totalItems;
    newOrder.previousBalance = orderInfo.previousBalance;
    newOrder.totalAmount = orderInfo.totalAmount;
    newOrder.amountPaid = orderInfo.amountPaid;
    newOrder.currentBalance = orderInfo.currentBalance;
    newOrder.isReturned = orderInfo.isReturned;
    orderInfo.isReturned ? newOrder.refID = orderInfo.refID : null;
    newOrder.paidBy = orderInfo.paidBy;

    return purchaseOrderDao.save(newOrder);
}

function getAllOrders(filter) {

    let query = {createdOn : {$gte: filter.fromDate, $lte: filter.toDate}};

    return purchaseOrderDao.find(query,PROJECTION.BASIC_INFO);
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    addPurchaserOrder,
    getAllOrders
};

//========================== Export Module End ===============================