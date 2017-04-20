"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash'),
    mongoose = require('mongoose');

//========================== Load internal modules ====================

const Purchasers = require('../model/Purchasers'),
    BaseDao = new require('../dao/baseDao'),
    purchaserDao = new BaseDao(Purchasers),
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
        _id: 1, profile: 1, balance: 1
    },
    COMPANY_DETAIL: {_id: 1, profile: 1, national: 1, salesId: 1, disabled: 1},
    ID: {_id: 1}
};

//=============================Define Methods Start=================================================

function addPurchaser(purchaserInfo) {
    let newPurchaser = {};

    newPurchaser.profile = {
      name: purchaserInfo.name,
      address: purchaserInfo.address,
      email: purchaserInfo.email,
      phone: []
    };

    newPurchaser.notes = purchaserInfo.notes;

    purchaserInfo.number1 ? newPurchaser.profile.phone.push(purchaserInfo.number1) : null;
    purchaserInfo.number2 ? newPurchaser.profile.phone.push(purchaserInfo.number2) : null;

    return purchaserDao.save(newPurchaser);
}

function addPurchasersss(brandInfo) {
    let query = {'brandName': brandInfo.brandName};
    let update = {'$push': {variants: {name: brandInfo.variantName, createdOn: Date.now()}}};

    return brandDao.findOneAndUpdate(query, update);
}

function getPurchasersDetails() {
    return purchaserDao.find({}, PROJECTION.BASIC_INFO);
}

function updateBalance(amount, user) {
    let query =  user.id ==0 ? { 'profile.name': user.name } : { _id : user.id };
    let update = {balance: amount};

    return purchaserDao.update(query, update);
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    addPurchaser,
    getPurchasersDetails,
    updateBalance
};

//========================== Export Module End ===============================