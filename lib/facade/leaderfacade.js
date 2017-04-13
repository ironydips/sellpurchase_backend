/**
 * Created by madhukar on 13/1/17.
 */
"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================
// Load log service
var leaderService = require('../services/leaderService');
var Promise = require("bluebird");
const _ = require("lodash");


//Load JWt Service
const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

function listLeaders(filters, options) {
  return leaderService.listLeaders(filters, options)
    .then(function (leaderInfo) {
      return leaderInfo;
    });
}

function removelBoard(leaderBoardId) {
  return leaderService.removelBoard(leaderBoardId);
}

function lBoardDetail(lId) {
  return leaderService.lBoardDetail(lId);
}

function addLeaderBoard(lbData) {
  return leaderService.addLeader(lbData);
}

function updateLeaderBoard(updateLBData) {
  return leaderService.updateLeaderBoard(updateLBData);
}


//========================== Export Module Start ===========================

module.exports = {
  listLeaders , removelBoard , lBoardDetail , addLeaderBoard , updateLeaderBoard
};
