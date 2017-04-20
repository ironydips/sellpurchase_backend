/**
 * Created by nitish on 23/12/16.
 */
"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load national dao
const nationalDao = require('../dao/orderItemDao');

//========================== Load Modules End ==============================================

function getNationals(filters, options) {
  return nationalDao.getNationals(filters, options);
}

function getCount(options, filters) {
  return nationalDao.getCount({}, filters)
    .then(function (count) {
      return {count: count};
    })
    .catch(function (err) {
      throw err;
    });
}

function deleteNationalById(id) {
  return nationalDao.deleteNationalById(id);
}

function getNational(filters, options) {
  return nationalDao.getNational(filters, options);
}

//========================== Export Module Start ==============================

module.exports = {
  getNationals,
  getCount,
  deleteNationalById,
  addNational: nationalDao.addNational,
  updateNational: nationalDao.updateNational,
  getNational: getNational,
  findNationalByName: nationalDao.findNationalByName
};

//========================== Export Module End ===============================
