"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash'),
  mongoose = require('mongoose');

//========================== Load internal modules ====================

const Brands = require('../model/Brands'),
  BaseDao = new require('../dao/baseDao'),
  brandDao = new BaseDao(Brands),
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

function addBrand(brandDetails) {
    let {brandName} = _.pick(brandDetails, ['brandName']);
    let newBrand = {};
    newBrand.brandName = brandName;

    return brandDao.save(newBrand);
}

function addVariantUnderBrand(brandInfo) {
    let query = {'brandName': brandInfo.brandName};
    let update = {'$push': {variants: {name: brandInfo.variantName, createdOn: Date.now()}}};

    return brandDao.findOneAndUpdate(query, update);
}

function getBrandInfo() {
    return brandDao.find({}, PROJECTION.BRAND_INFO);
}

//=============================Define Methods End=================================================

//========================== Export Module Start ==============================

module.exports = {
    addBrand,
    addVariantUnderBrand,
    getBrandInfo
};

//========================== Export Module End ===============================
