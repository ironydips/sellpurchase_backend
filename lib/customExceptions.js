//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
var constants = require("./constants");
var Exception = require("./model/Exception");

//========================== Load Modules End =============================

//========================== Export Module Start ==========================

module.exports = {
  intrnlSrvrErr: function (err) {
    return new Exception(1, constants.MESSAGES.intrnlSrvrErr, err);
  },
  unauthorizedAccess: function (errMsg, err) {
    return new Exception(2, errMsg ? errMsg : constants.MESSAGES.unAuthAccess, err);
  },
  unAuthenticatedAccess: function (errMsg, err) {
    return new Exception(24, errMsg, err);
  },
  resourceNotFound: function (errMsg, err) {
    return new Exception(3, errMsg);
  },
  tokenGenException: function (err) {
    return new Exception(3, constants.MESSAGES.tokenGenError, err);
  },
  invalidEmail: function () {
    return new Exception(4, constants.MESSAGES.invalidEmail);
  },
  getCustomErrorException: function (errMsg, error) {
    return new Exception(5, errMsg, error);
  },
  alreadyRegistered: function (err) {
    return new Exception(6, constants.MESSAGES.emailAlrdyRegistered, err);
  },
  incorrectPass: function () {
    return new Exception(7, constants.MESSAGES.incorrectPass);
  },
  userNotFound: function (err) {
    return new Exception(8, constants.MESSAGES.userNotFound, err);
  },
  passwordLinkExpired: function () {
    return new Exception(9, constants.MESSAGES.linkExpired);
  },
  getInvalidJwtTokenException: function () {
    return new Exception(13, constants.MESSAGES.failedToAuthenticateToken);
  },
  alreadyLoggedOut: function () {
    return new Exception(14, constants.MESSAGES.logout);
  },
  provideISoftId: function () {
    return new Exception(15, constants.MESSAGES.provideISoftId);
  },
  iSoftUserNotFound: function () {
    return new Exception(16, constants.MESSAGES.iSoftUserNotFound);
  },
  passwordFieldsMissing: function () {
    return new Exception(17, constants.MESSAGES.passCantEmpty);
  },
  passwordTokensMissing: function () {
    return new Exception(18, constants.MESSAGES.reset_token);
  },
  emailPasswordIncorect: function () {
    return new Exception(19, constants.MESSAGES.emailPasswordIncorrect);
  },
  resetTokenExpired: function () {
    return new Exception(20, constants.MESSAGES.resettokenExpired);
  },
  passwordNotSet: function () {
    return new Exception(21, constants.MESSAGES.passwordNotSetYet);
  },
  passwordNotMatch: function () {
    return new Exception(22, constants.MESSAGES.passwordNotMatch);
  },
  jwtError: function (msg) {
    return new Exception(23, msg);
  },
  validationError: function (errMsg, err) {
    return new Exception(25, errMsg ? errMsg : constants.MESSAGES.fieldMissing, err);
  },
  unableToDeleteCompany: function (err) {
    return new Exception(26, constants.MESSAGES.unableToDeleteCompany, err);
  },
  companyNotFound: function () {
    return new Exception(25, constants.MESSAGES.companyNotFound);
  },
  nationalNotFound: function () {
    return new Exception(25, constants.MESSAGES.nationalNotFound);
  },
  operationUnsuccessful: function (errMsg, err) {
    return new Exception(26, errMsg ? errMsg : constants.MESSAGES.operationUnsuccessful, err);
  },
  userAlreadyExists: function (err) {
    return new Exception(27, constants.MESSAGES.emailAlrdyRegistered);
  },
  managerNotFound: function (err) {
    return new Exception(28, constants.MESSAGES.managerNotFound);
  },
  inValidCsfCategory: function (errMsg) {
    return new Exception(29, errMsg);
  },
  noLeaderBoardDeleted: function (errMsg) {
    return new Exception(30, errMsg);
  },
  noLeaderBoardFound: function (errMsg) {
    return new Exception(30, errMsg);
  },
  noUpdtaePermissions : function () {
    return new Exception(25, constants.MESSAGES.noUpdtaePermissions);
  },
  csfAreadyAdded : function (errMsg) {
    return new Exception(31, errMsg);
  },
  categoryAlreadyExists :function (errMsg) {
    return new Exception(32, errMsg);
  }
};

//========================== Export Module End ===========================
