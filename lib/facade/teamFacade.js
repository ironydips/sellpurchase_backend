"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require('lodash');

//========================== Load internal modules ====================
// Load team service
const companyService = require('../services/adminService'),
  userService = require('../services/userService'),
  appUtils = require('../appUtils'),
  appConstants = require('../constants'),
  exceptions = require("../customExceptions");


//========================== Load Modules End ==============================================

function createTeam(filters) {
  return companyService.createTeam(filters)
    .then(companyDetail => {
      console.log(`team created ${JSON.stringify(companyDetail)}`);

      let {managers, members, companyId} = _.pick(filters, ['managers', 'members', 'companyId']);

      var ops = [];
      // add team to company in users
      ops.push(userService.addTeamInUserCompany({
        companyId: companyDetail._id,
        teamId: companyDetail.teams[0]._id,
        profile: companyDetail.teams[0].profile
      }));

      if (!_.isEmpty(members) && members.length > 0) {
        // add team to members
        ops.push(userService.addTeamToMembers({teamId: companyDetail.teams[0]._id, members: filters.members}));
      }

      if (!_.isEmpty(managers) && managers.length > 0) {
        // add team to managers
        ops.push(userService.addTeamToManagers({teamId: companyDetail.teams[0]._id, managers: filters.managers}));
      }

      return Promise.all(ops);
    })
    .then(result => {
      console.log(`createTeam result ${JSON.stringify(result)}`);
      return appConstants.MESSAGES.teamCreated;
    });
}

function updateTeam(filters) {
  return companyService.updateTeam(filters)
    .then(companyDetail => {
      console.log(`team updated ${JSON.stringify(companyDetail)}`);

      let {name, notes = "", managers = [], members = [], companyId, teamId} =
        _.pick(filters, ['name', 'notes', 'managers', 'members', 'companyId', 'teamId']);

      var ops = [];

      ops.push(userService.updateTeamInUserCompany({
        companyId: companyId,
        teamId: teamId,
        profile: companyDetail.teams[0].profile
      }));

      ops.push(userService.updateTeamInMembers({
        teamId: teamId,
        members: members,
        companyId: companyId
      }));

      ops.push(userService.updateTeamInManagers({
        teamId: teamId,
        managers: managers,
        companyId: companyId
      }));

      return Promise.all(ops);
    })
    .then(result => {
      console.log(`updateTeam result ${JSON.stringify(result)}`);
      return appConstants.MESSAGES.teamUpated;
    });
}

function deleteTeam(filters, options) {
  return companyService.deleteTeam(filters, options)
    .then(result => {
      console.log(`team deleted ${JSON.stringify(result)}`);
      var ops = [];
      // remove team from members
      ops.push(userService.removeTeamFromMembers(filters));
      // remove team from managers
      ops.push(userService.removeTeamFromManagers(filters));

      return Promise.all(ops);
    })
    .then(result=> {
      console.log(`deleteTeam result ${JSON.stringify(result)}`);
      return appConstants.MESSAGES.teamDeleted;
    });
}

//========================== Export Module Start ==============================

module.exports = {
  createTeam, updateTeam, deleteTeam
};

//========================== Export Module End ===============================

//==========================Private Method Start=============================

//==========================Private Method End=============================
