//========================== Load Modules Start ===========================

//========================== Load external Module =========================

const _ = require("lodash");

//========================== Load Internal Module =========================

const appUtils = require("../appUtils");
const appConst = require("../constants");
const exceptions = require("../customExceptions");

//========================== Load Modules End =============================


let validateLogin = function (req, res, next) {
  let {email, password} = req.body;

  // validate email
  if (!appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  // validate password
  if (!password) {
    return next(exceptions.validationError(appConst.MESSAGES.passCantEmpty));
  }

  next();
};

let validateForgotPass = function (req, res, next) {
  let {email} = req.body;

  // validate email
  if (!appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }
  next();
};

let validateResetPass = function (req, res, next) {
  let {password, token} = req.body;

  // validate password
  if (_.isEmpty(password)) {
    return next(exceptions.validationError(appConst.MESSAGES.passCantEmpty));
  }
  //validate reset token
  if (_.isEmpty(token)) {
    return next(exceptions.validationError(appConst.MESSAGES.reset_token));
  }
  next();
};

let validateAddUser = function (req, res, next) {
  let {firstName, email, companyName, companyId} = _.pick(req.body, ['firstName',
    'email', 'companyName', 'companyId']);

  if (_.isEmpty(firstName)) {
    return next(exceptions.validationError(appConst.MESSAGES.nameCantEmpty));
  }

  if (_.isEmpty(companyName) && _.isEmpty(companyId)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyIdBlank));
  }

  // validate email
  if (_.isEmpty(email) || !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  next();
};

let validateUpdateUser = function (req, res, next) {
  let {firstName, email, companyId, _id} = _.pick(req.body, ['firstName',
    'email', 'companyId', '_id']);

  if (_.isEmpty(firstName)) {
    return next(exceptions.validationError(appConst.MESSAGES.nameCantEmpty));
  }

  if (_.isEmpty(companyId)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyIdBlank));
  }

  // validate email
  if (_.isEmpty(email) || !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  if (_.isEmpty(_id)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdMissing));
  }

  next();
};

let validateInheritCsf = function (req, res, next) {
  let {userId, inheritCsfUserId, inheritRuleUserId} = _.pick(req.body, ['userId',
    'inheritCsfUserId']);

  if (_.isEmpty(userId)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdMissing));
  }

  if (_.isEmpty(inheritCsfUserId)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdMissing));
  }
  next();
};

let validateInheritRules = function (req, res, next) {
  let {userId, inheritRuleUserId} = _.pick(req.body, ['userId'
    , 'inheritRuleUserId']);

  if (_.isEmpty(userId)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdMissing));
  }

  if (_.isEmpty(inheritRuleUserId)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdMissing));
  }
  next();
};

let validateCsfSubmit = function (req, res, next) {
  let {userId, factorId, csfDate, factorName} = _.pick(req.body, ['userId', 'factorId', 'csfDate', "factorName"]);

  if (_.isEmpty(userId)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidUserID));
  }

  if (_.isEmpty(factorId)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidFactorId));
  }
  if (_.isEmpty(csfDate)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidCSFDAte));
  }
  if (_.isEmpty(factorName)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorName));
  }

  next();
};

let validateCsfEdit = function (req, res, next) {
  let {userId, factorId, csfDate, factorName, factorValue} = _.pick(req.body, ['userId', 'factorId', 'csfDate', "factorName", "factorValue"]);

  if (_.isEmpty(userId)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidUserID));
  }

  if (_.isEmpty(factorId)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidFactorId));
  }
  if (_.isEmpty(csfDate)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidCSFDAte));
  }
  if (_.isEmpty(factorName)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorName));
  }

  if (_.isEmpty(factorValue)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorValue));
  }

  next();
};

let validateLBAdd = function (req, res, next) {
  let {name, showLeaders, leaderCount, categories, factorsFilter, period, company, team, breakLevel, order, frequency, time, day, month, date, receivers, others, from, to}  = _.pick(req.body, ['name', 'showLeaders', 'leaderCount', 'categories', 'factorsFilter', 'period', 'company'
    , 'team', 'breakLevel', 'order', 'frequency', 'time', 'day', 'month', 'date', 'receivers', 'others', 'from', 'to']);

  if (_.isEmpty(name) || _.isEmpty(period) || _.isEmpty(team) || _.isEmpty(breakLevel) || _.isEmpty(order)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidleaderInput));
  }
  if (!showLeaders && (categories.length > 1 || factorsFilter.length > 1)) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidDataForLEADER));
  }

  if (!showLeaders && factorsFilter.length > 0) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidCSFForLEADER));
  }

  // validation for period
  let array = ['custom', 'custom-to-date', 'daily', 'current-week', 'last-week', 'last-month', 'quarterly', 'semi-annually', 'annually', 'x']
  if (period && _.indexOf(array, period) < 0) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidPeriodForLeader));
  }

  // validation for custoom and custom to date
  if (period && ((period == 'custom') || (period == 'custom-to-date'))) {
    if ((_.isEmpty(from) || _.isEmpty(to))) {
      return next(exceptions.validationError(appConst.MESSAGES.inValidDataForLEADER));
    }
  }
  // validation for frequency and time
  if (!frequency || !time) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidDataForFrequencyAndTime));
  }
  // validation for breaklevel
  let breakLevelArray = ['company', 'team', 'individual'];
  if (breakLevel && _.indexOf(breakLevelArray, breakLevel) < 0) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidBDLFForLeader));
  }
  // sort result
  if (order && ((order != "asc") && (order != "desc"))) {
    return next(exceptions.validationError(appConst.MESSAGES.inValidSortOrderForLeader));
  }

  next();
}

let validateCsfAdd = function (req, res, next) {
  let {csfCategory, csfFrequency, csfType, csfName, csfGoal, csfLimit, isCreateNewCSF, isSharable, csfCurrency, userIds, addAssign} = _.pick(req.body, ['csfCategory', 'csfFrequency', 'csfType', 'csfName', 'csfGoal', "csfLimit", "isCreateNewCSF", "isSharable", "csfCurrency", 'userIds', 'addAssign']);

  if (_.isEmpty(csfCategory) || _.isEmpty(csfType) || _.isEmpty(csfFrequency) || _.isEmpty(csfName)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorValue));
  }

  var array = ['weekly', 'daily', 'quarterly', 'annually', 'monthely']
  if (csfFrequency && _.indexOf(array, csfFrequency) < 0) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorFrequency));
  }

  var arrayType = ['number', 'currency', 'time'];
  if (csfType && _.indexOf(arrayType, csfType) < 0) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidFactorType));
  }

  next();
}

let createCompany = function (req, res, next) {
  let {name, zip, email} = _.pick(req.body, ['name', 'zip', 'email']);

  if (_.isEmpty(name)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyNameEmpty));
  }
  if (!_.isEmpty(zip) && !appUtils.isValidZipCode(zip)) {
    return next(exceptions.validationError(appConst.MESSAGES.zipNotValid));
  }
  if (!_.isEmpty(email) && !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  next();
};

let updateCompany = function (req, res, next) {
  let {_id, name, zip, email} = _.pick(req.body, ['name', '_id', 'email', 'zip']);

  // validate id
  if (_.isEmpty(_id)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyIdBlank));
  }
  if (_.isEmpty(name)) {
    return next(exceptions.validationError(appConst.MESSAGES.nationalNameEmpty));
  }

  if (!_.isEmpty(zip) && !appUtils.isValidZipCode(zip)) {
    return next(exceptions.validationError(appConst.MESSAGES.zipNotValid));
  }
  if (!_.isEmpty(email) && !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  next();
};

let createNational = function (req, res, next) {
  let {name, zip, email} = _.pick(req.body, ['name', 'zip', 'email']);

  if (_.isEmpty(name)) {
    return next(exceptions.validationError(appConst.MESSAGES.nationalNameEmpty));
  }
  if (!_.isEmpty(zip) && !appUtils.isValidZipCode(zip)) {
    return next(exceptions.validationError(appConst.MESSAGES.zipNotValid));
  }
  if (!_.isEmpty(email) && !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.nationalNameEmpty));
  }
  next();
};

let updateNational = function (req, res, next) {
  let {_id, name, zip, email} = _.pick(req.body, ['name', '_id', 'email', 'zip']);

  // validate id
  if (_.isEmpty(_id)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyIdBlank));
  }
  if (_.isEmpty(name)) {
    return next(exceptions.validationError(appConst.MESSAGES.nationalNameEmpty));
  }

  if (!_.isEmpty(zip) && !appUtils.isValidZipCode(zip)) {
    return next(exceptions.validationError(appConst.MESSAGES.zipNotValid));
  }
  if (!_.isEmpty(email) && !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }

  next();
};

let validateUpdateProfile = function (req, res, next) {
  let {firstName, email, companyId, roles} = _.pick(req.body, ['firstName',
    'email', 'companyId', 'roles']);

  if (_.isEmpty(firstName)) {
    return next(exceptions.validationError(appConst.MESSAGES.nameCantEmpty));
  }

  if (appUtils.hasRole(req.user, 'su') && _.isEmpty(companyId)) {
    return next(exceptions.validationError(appConst.MESSAGES.companyIdBlank));
  }

  // validate email
  if (_.isEmpty(email) || !appUtils.isValidEmail(email)) {
    return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
  }
  if (appUtils.isAdmin(req.user) && (!_.isArray(roles) || roles.length == 0)) {
    return next(exceptions.validationError(appConst.MESSAGES.roleCantEmpty));
  }
  if (appUtils.isAdmin(req.user) && _.intersection(roles, ['su', 'admin', 'manager']) == 0) {
    return next(exceptions.validationError(appConst.MESSAGES.cantSetUpSuchRoles));
  }
  next();
};

let unAssignUser = function (req, res, next) {
  let {userId, coachesIds, salesIds, managersIds} = _.pick(req.body, ['userId', 'coachesIds', 'salesIds', 'managersIds']);

  if (_.isEmpty(userId)) {
    return next(exceptions.validationError(appConst.MESSAGES.userIdEmpty));
  }

  if (_.isEmpty(coachesIds) && _.isEmpty(salesIds) && _.isEmpty(managersIds)) {
    return next(exceptions.validationError(appConst.MESSAGES.paramsNotFound));
  }

  if (!_.isEmpty(coachesIds) && !_.isArray(coachesIds)) {
    return next(exceptions.validationError(appConst.MESSAGES.arrayNotFound));
  }

  if (!_.isEmpty(salesIds) && !_.isArray(salesIds)) {
    return next(exceptions.validationError(appConst.MESSAGES.arrayNotFound));
  }

  if (!_.isEmpty(managersIds) && !_.isArray(managersIds)) {
    return next(exceptions.validationError(appConst.MESSAGES.arrayNotFound));
  }

  next();
};


//========================== Export Module Start ===========================

module.exports = {
  validateLogin,
  validateForgotPass,
  validateResetPass,
  validateAddUser,
  validateUpdateUser,
  validateInheritCsf,
  validateCsfSubmit,
  validateCsfEdit,
  validateInheritRules,
  validateLBAdd,
  validateCsfAdd,
  createCompany,
  updateCompany,
  createNational,
  updateNational,
  validateUpdateProfile,
  unAssignUser
};

//========================== Export module end ==================================
