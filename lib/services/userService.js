"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user dao
const usrDao = require('../dao/userDao');
//Load JWt Service
const jwtHandler = require('../jwtHandler');
const appUtils = require('../appUtils');
const exceptions = require("../customExceptions");
const appConstants = require("../constants");

//========================== Load Modules End ==============================================

/**
 *
 * @param options
 * @param filters
 * @returns {Promise.<T>|Promise}
 */

function listUsers(filters, options) {
  return usrDao.getUsers(filters, options)
    .then(function ({userInfo, pagingInfo}) {
      return {userInfo, pagingInfo};
    })
    .catch(function (err) {
      throw err;
    });
}
/**
 *
 * @param email
 * @param password
 * @returns {Promise|Promise.<T>}
 */
function login(email, password) {
  return usrDao.login(email, password)
    .then(function (user) {
      if (!user) {
        throw exceptions.resourceNotFound(appConstants.MESSAGES.incorrectEmailPass);
      } else if (!user.services.password.bcrypt) {
        throw exceptions.resourceNotFound(appConstants.MESSAGES.passwordNotSetYet);
      } else {
        let bcryptPass = user.services.password.bcrypt;
        if (appUtils.compareBcrypt(password, bcryptPass)) {
          return user;
        } else {
          throw exceptions.resourceNotFound(appConstants.MESSAGES.incorrectEmailPass);
        }
      }
    });
}

function addTokenToUser(jwtToken, user) {
  return usrDao.addTokenToUser(user._id, jwtToken);
}

function logout(id, jwtToken) {
  return usrDao.logout(id, jwtToken);
}

function deleteCompanyUsers(companyId) {
  return usrDao.deleteCompanyUsers(companyId);
}

function resetPassword({email}) {
  let randomToken = appUtils.generateResetPwdToken();
  return usrDao.resetPassword({email, randomToken});
}

function findByISoftId(iSoftId = "") {
  return usrDao.findByISoftId(iSoftId);
}

function disableISoftUser(iSoftId = "") {
  return usrDao.disableISoftUser(iSoftId);
}

function disableUser(filters, options) {
  return usrDao.disableUser(filters, options);
}

function assignVisibleCompanies(filters, options) {
  return usrDao.assignVisibleCompanies(filters, options);
}

function enrollUser(token) {
  return usrDao.findByToken(token)
    .then(function (user) {
      if (user != null && user.emails != null) {
        if (user.emails.verified) {
          let obj = {};
          if (user.services.password.bcrypt != null) {
            obj.code = "2";
            obj.msg = "Redirect to  login page";
            return obj;
          } else {
            obj.code = "1";
            obj.msg = "Redirect to password reset page";
            return obj; // for password reset page
          }
        } else {
          // verify email
          return usrDao.verifyUserEmail(user.emails[0].address)
            .then(function (data) {
              let obj = {};
              if (data && user.services.password.bcrypt != null) {
                obj.code = "2";
                obj.msg = "Redirect to  login page";
                return obj;
              } else {
                obj.code = "1";
                obj.msg = "Redirect to password reset page";
                return obj; // for password reset page
              }
            });
        }
      }
      else {
        throw exceptions.userNotFound();
      }
    });
}

function resetNewPassword({password = "", token = ""}) {
  return usrDao.resetNewPassword({password, token});
}

function getCount(options, filters) {
  return usrDao.getCount({}, filters)
    .then(function (count) {
      return {count: count};
    })
    .catch(function (err) {
      throw err;
    });
}

function getCompanyManagers(filters, options) {
  return usrDao.getCompanyManagers(filters, options);
}

function getSalesPersons(filters, options) {
  return usrDao.getSalesPersons(filters, options);
}

function numberOfUsersInTeam(filters, options) {
  return usrDao.numberOfUsersInTeam(filters, options);
}

function getTeamManagers(filters, options) {
  return usrDao.getTeamManagers(filters, options);
}

function addTeamInUserCompany(filters, options) {
  return usrDao.addTeamInUserCompany(filters, options);
}

function updateTeamInUserCompany(filters, options) {
  return usrDao.updateTeamInUserCompany(filters, options);
}

function addTeamToMembers(filters, options) {
  return usrDao.addTeamToMembers(filters, options);
}

function removeTeamFromMembers(filters, options) {
  return usrDao.removeTeamFromMembers(filters, options);
}

function addTeamToManagers(filters, options) {
  return usrDao.addTeamToManagers(filters, options);
}

function removeTeamFromManagers(filters, options) {
  return usrDao.removeTeamFromManagers(filters, options);
}

function updateTeamInMembers(filters, options) {
  return removeTeamFromMembers(filters, options)
    .then(function (result) {
      return addTeamToMembers(filters, options);
    });
}

function updateTeamInManagers(filters, options) {
  return removeTeamFromManagers(filters, options)
    .then(function (result) {
      return addTeamToManagers(filters, options);
    });
}

function userDetail(filters, options) {
  return usrDao.userDetail(filters, options);
}

function usersDetail(filters, options) {
  return usrDao.usersDetail(filters, options);
}

function userFactors(filters, options) {
  return usrDao.userFactors(filters, options);
}

function mergeFactors(selectedUserIds, userToInheritFactors) {
  console.log("selectedUserIds =", selectedUserIds);
  console.log("userToInheritFactors =", userToInheritFactors);

  if (_.isEmpty(selectedUserIds)) {
    return Promise.resolve({factors: []});
  }

  if (!_.isArray(selectedUserIds)) {
    selectedUserIds = [selectedUserIds];
  }

  let promiseList = [];

  // get selected users local/global CSFs
  promiseList.push(usrDao.usersFactors({userIds: selectedUserIds}));

  // adding factors to existing user
  if (userToInheritFactors) {
    // get inheriting user local/global CSFs
    promiseList.push(usrDao.userFactors({userId: userToInheritFactors}, {pageSize: "all"}));
  }

  return Promise.all(promiseList).then(function (result) {
    // merge the duplicate CSFs rules
    let selectedUserCSFIds = _.chain(result[0].userInfo).map(function (user) {
      return _.map(user.factors, function (factor) {
        return {_id: factor._id};
      });
    }).flatten().uniq("_id").filter(function (csfId) {
      return !!csfId._id;
    }).value();

    let assignedCSFIds = [];
    if (result[1]) {
      assignedCSFIds = _.chain(result[1].userInfo.factors).map(function (factor) {
        return {_id: factor._id};
      }).uniq("_id").filter(function (csfId) {
        return !!csfId._id;
      }).value();
    }

    console.log("assignedCSFIds length =", assignedCSFIds.length);
    console.log("selectedUserCSFIds length =", selectedUserCSFIds.length);
    var csfIdsToInherit = selectedUserCSFIds.filter(function (selectedUserCSFId) {
      return assignedCSFIds.filter(function (assignedCSFId) {
          return assignedCSFId._id == selectedUserCSFId._id;
        }).length == 0;
    });

    console.log("csfIdsToInherit length =", csfIdsToInherit.length);
    return {
      factors: csfIdsToInherit,
    };
  });
}

function getAssignedUsers(filters, options) {
  options.fields = _.assign({}, usrDao.PROJECTION.BASIC_PROFILE, usrDao.PROJECTION.COMPANY_BASIC_PROFILE);
  return usrDao.getAssignedUsers(filters, options);
}

function reportUserFactors(filters, options) {
  return usrDao.reportUserFactors(filters, options);
}

function assignManager(filters, options) {
  return usrDao.assignManager(filters, options);
}

function updateCompanyInUsers(companyDetail) {
  return usrDao.updateCompanyInUsers(companyDetail);
}

function unAssignUsers(detail) {
  return usrDao.unAssignUsers(detail);
}

//========================== Export Module Start ===========================

module.exports = {
  listUsers,
  login,
  logout,
  deleteCompanyUsers,
  resetPassword,
  addTokenToUser,
  findByISoftId,
  disableISoftUser,
  getUsers: usrDao.getUsers,
  resetNewPassword,
  getUserById: usrDao.getUserById,
  enrollUser,
  getCount,
  getCompanyManagers,
  getSalesPersons,
  numberOfUsersInTeam,
  disableUser,
  assignVisibleCompanies,
  addTeamInUserCompany,
  updateTeamInUserCompany,
  addTeamToMembers,
  removeTeamFromMembers,
  addTeamToManagers,
  removeTeamFromManagers,
  updateTeamInMembers,
  updateTeamInManagers,
  addNewUser: usrDao.addNewUser,
  getUsersFactors: usrDao.getUsersFactors,
  checkEmailAlreadyExist: usrDao.checkEmailAlreadyExist,
  userDetail: userDetail,
  usersDetail: usersDetail,
  getCoaches: usrDao.getCoaches,
  userFactors: userFactors,
  mergeFactors: mergeFactors,
  getAssignedUsers: getAssignedUsers,
  userInheritCsf: usrDao.mergeFactorsOnUserBasis,
  reportUserFactors: reportUserFactors,
  updateUser: usrDao.update,
  assignManager: assignManager,
  getCompanyTeamMembers: usrDao.getCompanyTeamMembers,
  getTeamManagers: getTeamManagers,
  deleteUser: usrDao.deleteUser,
  updateMyProfile: usrDao.updateMyProfile,
  updateCompanyInUsers,
  unAssignUsers
};

//========================== Export module end ==================================
