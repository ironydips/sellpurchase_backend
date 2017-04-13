"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user dao
const reportDao = require('../dao/reportDao');
const appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

function reportDetail(filters) {
  return reportDao.reportDetail(filters);
}

function generateReport(filters, options) {
  let range = appUtils.getRangeByPeriod(filters.period, filters.periodDays, filters.from, filters.to);
  filters.to = range.to.format();
  filters.from = range.from.format();

  filters.factors = filters.factors ? filters.factors : [];

  // get and extend only points that present in the database
  /*_.forEach(points, function (point) {
    var dbPoint = Points.findOne(point._id);
    _.extend(point, dbPoint && dbPoint || { exists: false });
  });*/
  // ToDo: Get Points from DB

  // get the factors from custom data points
  /*_.forEach(points, function (point) {
    var flow = point.flow.slice();
    var value, operation;
    // get factor ids that exist in point
    pointsFactorsIds = _.chain(flow)
      .filter(function (item, index) {
        // factors are placed on even flow array indices
        return index % 2 === 0;
      })
      .uniq()
      .value();

    factorsInCustomDataPoints.push(pointsFactorsIds);
  });*/

  // get valid factors
  /*paramFactors = _.chain(params.factors)
    .filter(function (factor) {
      return factor.condition // for conditions added in factors
        ? factor.value && factor.period
        : !!factor._id;
    })
    .value();*/
}

//========================== Export Module Start ===========================

module.exports = {
  reportDetail, generateReport
}

//========================== Export Module End ===========================
