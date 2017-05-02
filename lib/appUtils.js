"use strict";

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

const _ = require('lodash');
const sha256 = require('sha256');
//const bcrypt = require('bcrypt');
const moment = require('moment');

//========================== Load Internal Module =========================

const appConstants = require('./constants');
const _mixin = require('./_mixin');

//========================== Load Modules End =============================


//========================== Export Module Start ===========================


/**
 * return user home
 * @returns {*}
 */
function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getNodeEnv() {
  return process.env.NODE_ENV;
}

function getWebUrl() {
  // http://dev.algoworks.com/angular-csf/
  return process.env.CSF_WEBSITE_URL;
}

function isProdEnv() {
  let env = getNodeEnv();
  return _.includes(["prod", "production"], env);
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
  let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return new RegExp(pattern).test(email);
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidZipCode(email) {
  let pattern = /^\d{5}(?:[-\s]\d{4})?$/;
  return new RegExp(pattern).test(email);
}

/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function createHashSHA256(pass) {
  return sha256(pass);
}

/**
 * returns random number for password
 * @returns {string}
 */
let getRandomPassword = function () {
  return getSHA256(Math.floor((Math.random() * 1000000000000) + 1));
};

let getSHA256 = function (val) {
  return sha256(val + "password");
};

//let encryptHashPassword = function (password, salt) {
 // return bcrypt.hashSync(password, salt);
//};

//let generateSaltAndHashForPassword = function (password) {
 // if (_.isEmpty(password)) {
   // return " ";
 // }
  //let encryptPassword = {salt: "", hash: ""};
  //encryptPassword['salt'] = bcrypt.genSaltSync(10);
 // encryptPassword['hash'] = bcrypt.hashSync(password, encryptPassword['salt']);
  //return encryptPassword;
//};

//var compareBcrypt = function (password, bcryptPass) {
 // return bcrypt.compareSync(password, bcryptPass);
//};

/**
 *
 * @param string
 * @returns {boolean}
 */
let stringToBoolean = function (string) {
  switch (string.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    case "false":
    case "no":
    case "0":
    case null:
      return false;
    default:
      return Boolean(string);
  }
};

var getCollectionParams = function (params, collName) {
  return {
    sortBy: params.sortBy ? params.sortBy : _getDBProfileKeys(collName)[0],
    sortOrder: params.sortOrder ? params.sortOrder : 'asc',
    pageNo: params.pageNo ? params.pageNo : 1,
    pageSize: params.pageSize ? params.pageSize : 10,
    skip: function () {
      return (this.pageNo - 1) * this.pageSize;
    }
  };
};

//function generateResetPwdToken() {
  //let randomSHA256Token = getRandomPassword();
 // let randomBcrpytToken = generateSaltAndHashForPassword(randomSHA256Token);
 // return randomBcrpytToken.hash;
//}

function getResetPasswordLink(token) {
  return getWebUrl() + `reset-password/${token}`;
}


function getUserEnrollLink(token) {
  return getWebUrl() + `/enroll/${token}`;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Rounds a value to 2 decimal points.
 *
 * @param  {String|Number} value The value to be rounded.
 * @return {Number}              The rounded value.
 */
function round(value) {
  var type = typeof value;
  var isString = type === 'string';
  var isNumber = type === 'number';

  if (typeof value === 'undefined' || value === null || (!isString && !isNumber)) return null;

  if (isString) value = parseFloat(value);

  return parseFloat(value.toFixed(2));
}

let testUsers = ["esolima@southwestern.com",
  "LLewis@swgao.com",
  "tushar.bisht@mobicules.com",
  "arpit@mobicules.com",
  "swccoaching@southwesternconsulting.com",
  "SWC_cbing@southwesternconsulting.com",
  "yash.sonkar@algoworks.com",
  "piyush.gahlot@algoworks.com"];

function isTestUsers(sendingTo) {
  if (_.includes(testUsers, sendingTo) ||
    (sendingTo.split("@")[1] === "algointra.com")) {
    return true;
  }

  return false;
}

function getCurrentDateString(date){
  let dat = new Date(date)|| new Date();

  dat.setHours(0,0,0,0);

  return dat.toISOString();
}

function getNextDateSting(date, number){
  let dat = new Date(date) || new Date();
  let num = number || 1;

  dat.setDate(dat.getDate() + num);

  dat.setHours(0,0,0,0);

  return dat.toISOString();
}

//========================== Export Module Start ===========================

module.exports = {
  getNodeEnv,
  isValidEmail,
  isValidZipCode,
  appHttpClient: require("./appHttpClient"),
  getCollectionParams,
  getQueryWithFilters,
  getDBQualifiedKey,
  setHeadersForCrossDomainIssues,
  getQueryParams,
  //generateSaltAndHashForPassword,
  //compareBcrypt,
  //generateResetPwdToken,
  getResetPasswordLink,
  getWebUrl,
  getSortSkipLimitParams,
  getRangeByPeriod,
  replaceAll,
  escapeRegExp,
  getUserEnrollLink,
  round,
  isTestUsers,
  isProdEnv,
  isAdmin,
  isClient,
  isCoach,
  isManager,
  isSales,
  hasRole,
  getCurrentDateString,
  getNextDateSting
};

//========================== Export Module End===========================

//===========================DB Utility==================================

function getQueryWithFilters(filters, dbName) {
  let query = {};
  if (filters) {
    _.forEach(filters, function (value, key) {

      if (filters[key]) {

        switch (key) {
          case appConstants.DB_KEYS.NAME  :
            query[getDBQualifiedKey(key, dbName)] = new RegExp(value, 'i');
            break;
          case appConstants.DB_KEYS.EMAIL :
            query[getDBQualifiedKey(key, dbName)] = new RegExp(value, 'i');
            break;
          case appConstants.DB_KEYS.SEARCH :
            query[getDBQualifiedKey(_getSearchKeys(dbName), dbName)] = new RegExp(value, 'i');
            break;
          default:
            query[key] = value;
            break;
        }
      }
    });
  }
  return query;
}

function getDBQualifiedKey(key, dbName) {

  switch (dbName) {

    //Companies DB , Nationals DB
    case appConstants.KEYS.COMPANIES_NATIONAL :
      return _getDBProfileKeys(dbName).indexOf(key) > -1 ? appConstants.KEYS.NATIONAL + appConstants.KEYS.DOT + appConstants.KEYS.PROFILE + appConstants.KEYS.DOT + key : key;
    case appConstants.KEYS.COMPANIES :
    case appConstants.KEYS.NATIONALS :
    default:
      return _getDBProfileKeys(dbName).indexOf(key) > -1 ? appConstants.KEYS.PROFILE + appConstants.KEYS.DOT + key : key;
  }
}

function setHeadersForCrossDomainIssues(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization, x-custom-token");
  res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
  return res;
}

function getQueryParams(options, filters, dbName) {

  let query = getQueryWithFilters(filters, dbName);

  if (options.sortBy) {
    let sortBy = getDBQualifiedKey(options.sortBy, dbName);
    options = {skip: options.skip(), limit: options.pageSize * 1, sort: {[sortBy]: options.sortOrder}};
  }
  return {query: query, options: options};
}

function getSortSkipLimitParams({pageNo = 1, pageSize = 10, sortOrder = 1, sortBy}) {
  let sortSkipLimit = {};

  if (pageSize === "all") {
    console.log("return all listing");
  } else {
    sortSkipLimit.skip = (pageNo - 1) * pageSize;
    // to convert string to int
    sortSkipLimit.limit = 1 * pageSize;
  }

  if (sortBy) {
    sortSkipLimit.sort = {[sortBy]: sortOrder == 1 ? 1 : -1};
  }
  return sortSkipLimit;
}

function _getDBProfileKeys(dbName) {
  let keys = [];
  switch (dbName) {
    case appConstants.KEYS.COMPANIES:
      keys = ['name', 'email', 'sales', 'city', 'state', 'zip', 'country', 'address', 'phone', 'notes'];
      break;
    case appConstants.KEYS.COMPANIES_NATIONAL:
    case appConstants.KEYS.NATIONALS:
      keys = ['name', 'email', 'city', 'state', 'zip', 'country', 'address', 'phone', 'notes'];
      break;
    case appConstants.KEYS.USERS:
      keys = ['profile.firstName', 'lastName', 'city', 'state', 'zip', 'country', 'address', 'phone', 'notes'];
      break;
    default:
      keys = ['name'];
      break;
  }
  return keys;
}

function _getSearchKeys(dbName) {
  let searchKey;

  switch (dbName) {
    case appConstants.KEYS.USERS:
      searchKey = _getDBProfileKeys(dbName)[0];
      break;
    default:
      searchKey = _getDBProfileKeys(dbName)[0];
      break;
  }

  return searchKey;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Gets periods as string (weekly, monthly, etc.) append
 * returns appropriate period as { from, to }:
 * - daily:
 *   - from: start of today;
 *   - to: now
 * - weekly:
 *   - from: start of current week (Monday);
 *   - to: now or end of Friday (if is weekend today);
 * - last-week:
 *   - from: start of last week (Monday);
 *   - to: last Friday;
 * - monthly:
 *   - from: start of current month;
 *   - to: now;
 * - last-month:
 *   - from: start of last month;
 *   - to: end of last month;
 * - quarterly:
 *   - from: start of current quarter;
 *   - to: now;
 * - semi-annually:
 *   - from: start of current half-year ( 1th of Jan of 1th of Jul );
 *   - to: now;
 * - annually:
 *   - from: start of current year;
 *   - to: now;
 * - x (x days length):
 *   - from start of day x days ago;
 *   - to: now;
 * - custom:
 *   - from: from (selected on calendar);
 *   - to: to (selectd on calendar).
 * @param {String} period
 * @param {Number} periodDays - x
 * @return {Object:{from:{Moment},to:{Moment}}}
 */
function getRangeByPeriod(period = 'custom', periodDays = 1, from, to, userId) {
  if (period !== 'custom') {
    to = moment(new Date());
  }

  let month;
  switch (period) {
    case 'daily':
      from = moment(to).startOf('day');
      break;
    case 'weekly':
      from = moment(to).startOf('isoWeek');

      if (moment(to).isoWeekday() > 5) {
        to = moment(to).isoWeekday(5).endOf('day');
      }
      break;
    case 'last-week':
      from = moment(to).subtract(1, 'weeks').startOf('isoWeek');
      to = moment(to).subtract(1, 'weeks').isoWeekday(5).endOf('day');
      break;
    case 'last-month':
      from = moment(to).subtract(1, 'months').startOf('month');
      to = moment(to).subtract(1, 'months').endOf('month');
      break;
    case 'monthly':
      from = moment(to).startOf('month');
      break;
    case 'quarterly':
      from = moment(to).startOf('quarter');
      break;
    case 'semi-annually':
      month = to.month();
      if (month >= 6) {
        from = moment(to).month(6).startOf('month');
      } else {
        from = moment(to).startOf('year');
      }
      break;
    case 'annually':
      from = moment(to).startOf('year');
      break;
    case 'x':
      from = moment(to).subtract(periodDays - 1, 'days').startOf('day');
      break;
    case 'custom-to-date':
      from = moment(from);
      break;
    case 'custom':
      from = moment(from);
      to = moment(to);
  }

  return {from, to};
}

/**
 * Checks if a user has specific role.
 * @param  {String|Object} user The user id or user itself.
 * @param  {String}        name The role names in form of role1|role2 etc.
 * @return {Boolean}            True if role presents.
 */
function hasRole(user, names) {
  var hasRole = false, roles;

  if (!user)
    return false;

  names = names.split('|');


  if (!user)
    return false;

  roles = user.roles || [];

  if (roles.length) {
    for (var i = names.length - 1; i >= 0; i--) {
      if (roles.indexOf(names[i]) > -1) hasRole = true;
    }
  } else {
    return false;
  }

  return hasRole;
};
/**
 * Checks if a user has an admin role.
 *
 * @param  {String} userId The id of the user being checked.
 * @return {Boolean}       True if admin.
 */
function isAdmin(user) {
  return hasRole(user, 'su|admin');
}

function isCoachAndmanager(user) {
  return hasRole(user, 'coach|manager');
}

function isCoach(user) {
  return hasRole(user, 'coach');
}

function isSales(user) {
  return hasRole(user, 'sales');
}

/**
 * Checks if a user has a manager role.
 *
 * @param  {String} userId The id of the user being checked.
 * @return {Boolean}       True if manager.
 */
var isManager = function (user) {
  return hasRole(user, 'manager');
};

var isClient = function (user) {
  return hasRole(user, 'client');
};



