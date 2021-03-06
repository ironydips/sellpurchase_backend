"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash'),
    mongoose = require('mongoose');

//========================== Load internal modules ====================

const OrderItems = require('../model/OrderItems'),
    BaseDao = new require('../dao/baseDao'),
    orderItemDao = new BaseDao(OrderItems),
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
        _id: 1, profile: 1, lastBalance: 1
    },
    COMPANY_DETAIL: {_id: 1, profile: 1, national: 1, salesId: 1, disabled: 1},
    ID: {_id: 1}
};

//=============================Define Methods Start=================================================

function addOrderItems(orderItems) {

    return orderItemDao.insertMany(orderItems);
}

function getOrderItems(order, showRelatedInfo) {
    let query = [];
    let match ={};

    for(let key in order){
        switch(key){
            case 'id': match._id = order.id; break;
            case 'brandName': match.brandName = order.brandName; break;
            case 'variantName': match.variantName = order.variantName; break;
            case 'fromDate': match.createdOn = {$gte : new Date(order.fromDate), $lte: new Date(order.endDate)}; break;
            default: break;
        }
    }

    query.push({$match : match});


    if(showRelatedInfo){
        query.push({
            $lookup: {
                from : 'purchasers',
                localField: 'userID',
                foreignField: '_id',
                as: 'purchaser_info'
            }
        });
    }

    // //TODO: for sellers
    // query.push({
    //     $lookup: {
    //         from : $isPurchaser ? 'purchasers': 'sellers',
    //         localField: 'userID',
    //         foreignField: '_id',
    //         as: 'user_info'
    //     }
    // });

    return orderItemDao.aggregate(query);
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    addOrderItems,
    getOrderItems
};

//========================== Export Module End ===============================