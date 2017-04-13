"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load point dao
const pointDao = require('../dao/pointDao');
const appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

function pointsDetail(factors, options) {
  return pointDao.pointsDetail(factors, options)
    .then(result => {
      // result = result.toObject();

      // get the factors from custom data points
      _.forEach(result, function (point) {
        var flow = point.flow.slice();
        // get factor ids that exist in point
        let pointsFactorsIds = _.chain(flow)
          .filter(function (item, index) {
            // factors are placed on even flow array indices
            return index % 2 === 0;
          })
          .uniq()
          .value();
        point.factors = pointsFactorsIds;
      });

      return result;
    });
}

//========================== Export Module Start ===========================

module.exports = {
  pointsDetail
};

//========================== Export module end ==================================
