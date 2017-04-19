"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash'),
    mongoose = require('mongoose');

//========================== Load internal modules ====================

const Stocks = require('../model/Stocks'),
    BaseDao = new require('../dao/baseDao'),
    stockDao = new BaseDao(Stocks),
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
    BRAND_INFO: {
        _id: 1, brandName: 1, "variants.name": 1, "variants._id": 1
    },
    COMPANY_DETAIL: {_id: 1, profile: 1, national: 1, salesId: 1, disabled: 1},
    ID: {_id: 1}
};

//=============================Define Methods Start=================================================

function getWarehouseItems() {
    return stockDao.find({}, {});
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    getWarehouseItems
};

//========================== Export Module End ===============================