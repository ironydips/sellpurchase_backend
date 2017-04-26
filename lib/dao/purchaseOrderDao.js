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
    newOrder.purchaserName = orderInfo.purchaserName;
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

    let query = {};

    filter.fromDate = filter.fromDate && (new Date(filter.fromDate)).toISOString();

    if(filter.toDate){
        let dat = new Date(filter.toDate);
        dat.setDate(dat.getDate() + 1);
        filter.toDate = dat.toISOString();
    }

    (filter.fromDate && filter.toDate) ? query.createdOn = { $gte: filter.fromDate, $lte: filter.toDate } : null;

    (filter.orderID) ? query._id = filter.orderID : null;

    return Object.keys(query).length > 0 ? purchaseOrderDao.find(query,PROJECTION.BASIC_INFO) : Promise.resolve(null);
}

function getFullOrderDetails(id) {
    let query = [{
        $match: {
            _id : new mongoose.Types.ObjectId(id)
        }
    }];

    //get look up order items
    query.push({
        $lookup: {
            from : 'orderItems',
            localField: '_id',
            foreignField: 'orderID',
            as: 'order_items'
        }
    });

    //get purchaser items
    query.push({
        $lookup: {
            from : 'purchasers',
            localField: 'purchaserID',
            foreignField: '_id',
            as: 'purchaser_info'
        }
    });

    //Displayed Fields.
    query.push({
        $project: {
            'purchaserName' :1,
            'amountPaid': 1,
            'createdOn': 1,
            'isReturned': 1,
            'currentBalance': 1,
            'totalAmount': 1,
            'previousBalance': 1,
            'totalItems': 1,
            'order_items.brandName': 1,
            'order_items.variantName': 1,
            'order_items.price': 1,
            'order_items.quantity': 1,
            'purchaser_info.profile': 1
        }
    });

    return purchaseOrderDao.aggregate(query);
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    addPurchaserOrder,
    getAllOrders,
    getFullOrderDetails
};

//========================== Export Module End ===============================