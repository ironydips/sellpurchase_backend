"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user service
const usrService = require('../services/userService'),
  companyService = require('../services/adminService'),
  rulesService = require('../services/rulesService'),
  pointService = require('../services/pointService'),
  csfService = require('../services/purchaseService'),
  emailService = require('../services/emailService'),
  reportService = require('../services/reportService'),
  exceptions = require('../customExceptions');

const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

function generateReport(filters, options) {
  let {
    companiesIds, teamsIds, usersIds, categoriesIds,
    period, from, to, periodDays, factorsIds, pointsIds
  } = _.pick(filters, ['companiesIds', 'teamsIds', 'usersIds', 'categoriesIds',
    'period', 'from', 'to', 'periodDays', 'factorsIds', 'pointsIds']);

  let {includeManagersStats} = _.pick(options, ['includeManagersStats']);

  let points, factorsInCustomDataPoints;
  let range = appUtils.getRangeByPeriod(period, periodDays, from, to);

  // get and extend only points that present in the database
  return pointService.pointsDetail({pointsIds})
    .then(pointDetails => {
      if (pointDetails) {
        points = pointDetails;
      }

      // at least one of four params must be provided
      // ignore other values if 'all' is specified
      if (companiesIds && companiesIds.indexOf('all') > -1)
        companiesIds = 'all';
      if (teamsIds && teamsIds.indexOf('all') > -1)
        teamsIds = 'all';
      if (usersIds && usersIds.indexOf('all') > -1)
        usersIds = 'all';
      if (categoriesIds && categoriesIds.indexOf('all') > -1) {
        categoriesIds = 'all';
      }

      // if (includeManagersStats && (breakLevel === 'team' || viewMode === 'team')) {
      //   let managedTeams;
      //   let teamsQuery = {};
      //
      //
      //   if (teamsIds && teamsIds.length) {
      //     managedTeams = teamsIds;
      //   } else if (usersIds && usersIds.length) {
      //     managedTeams = _.chain(
      //       Meteor.users.find({_id: {$in: usersIds}}).fetch() || []
      //     )
      //       .pluck('teamId')
      //       .compact()
      //       .uniq()
      //       .value();
      //   } else {
      //     if (companiesIds && companiesIds.length)
      //       teamsQuery._id = {$in: companiesIds};
      //
      //     managedTeams = _.chain(Companies.find(teamsQuery).fetch())
      //       .map(company => _.pluck(company.teams || [], '_id'))
      //       .flatten()
      //       .compact()
      //       .value();
      //   }
      //
      //   _.each(managedTeams, team => {
      //     let teamManagers = Meteor.users.find({
      //       roles: 'manager',
      //       managedTeams: {$in: [team]}
      //     }, {
      //       fields: {
      //         factors: 1,
      //         'company._id': 1,
      //         'company.profile.name': 1,
      //         teamId: 1,
      //         profile: 1
      //       }
      //     }).fetch();
      //
      //     if (teamManagers && teamManagers.length) {
      //       _.each(teamManagers, manager => {
      //         if (!_.find(users, user =>
      //           user._id === manager._id
      //           && (!_.isArray(user.teamId || []) ? [user.teamId] : user.teamId ).indexOf(team) !== -1)
      //         ) {
      //           manager.teamId = [team];
      //           reportedUser.push(manager);
      //         }
      //       });
      //     }
      //   });
      // }

      let includeDeactivatedUsers = true;
      let reportFilters = {includeDeactivatedUsers, categoriesIds, usersIds, companiesIds};
      return usrService.reportUserFactors(reportFilters, options);
    })
    .then(reportingUserFactors => {
      return csfService.getReportFactorDetail(reportingUserFactors);
      // populate users with team managers
    });
}

function reportDetail(filters, options) {
  return reportService.reportDetail(filters, options);
}

//========================== Export Module Start ===========================

module.exports = {
  generateReport, reportDetail
};

//========================== Export module end ==================================
