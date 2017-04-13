/**
 * Created by nitish on 23/12/16.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');

//========================== Load internal modules ====================

const National = require('../model/Nationals'),
  BaseDao = new require('../dao/baseDao'),
  nationalDao = new BaseDao(National),
  appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

const NATIONAL_UPDATE_FIELDS = ["name", "sales", "address", "city",
  "state", "zip", "country", "email", "notes", "phone"];

//Define Projections
const PROJECTION = {
  ALL: {},
  BASIC_PROFILE: {_id: 1, profile: 1},
};

const SORT_BY = {
  name: 'profile.name',
  email: 'profile.email',
  country: 'profile.country',
  city: 'profile.city',
  address: 'profile.address'
};

//=============================Define Methods Start=================================================


function getNationals(filters, options) {
  let {search, user} = _.pick(filters, ['search', 'user']);
  let projection = PROJECTION.BASIC_PROFILE;

  let query = {};
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    query["profile.name"] = regularExpression;
  }

  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.NAME;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  let promiseList = [];
  promiseList.push(nationalDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    promiseList.push(nationalDao.count(query));
  }

  return Promise.all(promiseList)
    .then(result => {
      let response = {nationalInfo: result[0]};

      if (result[1]) {
        response.pagingInfo = {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        };
      }
      return response;
    });
}

function getNational(filters, options = {}) {
  let query = {}, projection = PROJECTION.BASIC_PROFILE;
  if (filters.nationalId) {
    query._id = filters.nationalId;
  }

  if (options.fields) {
    projection = options.fields;
  }

  return nationalDao.findOne(query, projection);
}

function getCount(options, filters) {
  var params = appUtils.getQueryParams(options, filters, appConstants.KEYS.NATIONALS);
  return nationalDao.count(params.query);
}

function deleteNationalById(filters, options) {
  let query = {'_id': filters._id};
  return nationalDao.remove(query);
}

function addNational(nationalDetails) {
  let nationalDetail = _.pick(nationalDetails, ['name', 'address', 'city',
    'state', 'zip', 'country', 'phone', 'email', 'notes']);
  let national = {profile: nationalDetail};
  return nationalDao.save(national);
}

function updateNational(nationalDetails) {
  let {_id, name} = _.pick(nationalDetails, ['_id', 'name']);

  let nationalPromise;
  // check if name of national is updating it should not be conflicting
  if (nationalDetails.name) {
    let query = {'profile.name': nationalDetails.name, '_id': {$ne: nationalDetails._id}};
    nationalPromise = nationalDao.findOne(query);
  } else {
    nationalPromise = Promise.resolve(null);
  }

  return nationalPromise.then(function (result) {
    if (result) {
      return Promise.reject(appConstants.MESSAGES.nationalNameAlreadyExist);
    } else {
      let query = {"_id": nationalDetails._id};

      let nationalProfileToUpdate = {};
      _.forEach(NATIONAL_UPDATE_FIELDS, function (item, itemIndex) {
        if (nationalDetails[item]) {
          nationalProfileToUpdate["profile." + item] = nationalDetails[item];
        }
      });

      if (_.isEmpty(nationalProfileToUpdate)) {
        return Promise.reject(appConstants.MESSAGES.nothingToUpdate);
      } else {
        return nationalDao.update(query, nationalProfileToUpdate);
      }
    }
  });
}

function _updateNational(nationalDetails) {
  let updateNational = {};
  let query = {"_id": nationalDetails._id};

  _.forEach(nationalDetails, function (value, key) {
    if (key == '_id') {
      return;
    }
    updateNational[appUtils.getDBQualifiedKey(key, appConstants.KEYS.COMPANIES)] = value;
  });

  return nationalDao.update(query, updateNational);

}

function findNationalByName(nationalDetails) {
  let {name} = _.pick(nationalDetails, ['name']);
  let query = {'profile.name': name};
  return nationalDao.findOne(query);
}

//========================== Export Module Start ==============================

module.exports = {
  getNationals,
  getNational,
  getCount,
  deleteNationalById,
  addNational,
  updateNational,
  findNationalByName
};

//========================== Export Module End ===============================
