"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user service
const usrService = require('../services/userService'),
  companyService = require('../services/adminService'),
  rulesService = require('../services/rulesService'),
  csfService = require('../services/purchaseService'),
  emailService = require('../services/orderItemService'),
  exceptions = require('../customExceptions');

//Load JWt Service
const appUtils = require('../appUtils'),
  appConstants = require('../constants');

//========================== Load Modules End ==============================================

/**
 *
 * @param filters
 * @param options
 * @returns {Promise.<TResult>|Promise}
 *
 * list users on the basis of roles manage users
 */
function listUsers(filters, options) {
  return usrService.listUsers(filters, options)
    .then(function (userInfo) {
      return userInfo;
    });
}

/**
 * @function login
 * login via email
 * @param {Object} loginInfo login details
 */
function login({email, password}) {
  return usrService.login(email, password);
}

function getSalesPersons(filters, options) {
  return usrService.getSalesPersons(filters, options);
}

function getCoaches(filters, options) {
  return usrService.getCoaches(filters, options);
}

function isChiefUser(userId) {
  return usrService.getUserById(userId)
    .then(function (user) {
      return user.company && user.company.chief ? true : false;
    });
}

function disableUser(filters) {
  return usrService.disableUser(filters)
    .then(function (result) {
      if (result) {
        console.log(`result ${JSON.stringify(result)}`);
        if (filters.disable == 0) {
          return appConstants.MESSAGES.userActivated;
        } else {
          return appConstants.MESSAGES.userDeactivated;
        }
      } else {
        throw exceptions.userNotFound();
      }
    });
}

function assignVisibleCompanies(filters, options) {
  return usrService.assignVisibleCompanies(filters, options)
    .then(function (result) {
      if (result) {
        if (filters.assign == 1) {
          return appConstants.MESSAGES.companyAssignedSuccesfully;
        } else {
          return appConstants.MESSAGES.companyunAssignedSuccesfully;
        }
      } else {
        throw exceptions.userNotFound();
      }
    });
}

function userDetail(filter, option) {
  return usrService.userDetail(filter, option)
    .bind({})
    .then(function (userDetail) {
      if (userDetail) {
        this.userInfo = userDetail.toObject();
        let userDetailPromise = [];
        if (userDetail.salesIds && userDetail.salesIds.length > 0) {
          console.log(`userDetail.salesIds ${JSON.stringify(userDetail.salesIds)}`);
          userDetailPromise.push(usrService.usersDetail({userIds: userDetail.salesIds}));
        }
        if (userDetail.managersIds && userDetail.managersIds.length > 0) {
          console.log(`userDetail.managersIds ${JSON.stringify(userDetail.managersIds)}`);
          userDetailPromise.push(usrService.usersDetail({userIds: userDetail.managersIds}));
        }
        if (userDetail.coachesIds && userDetail.coachesIds.length > 0) {
          console.log(`userDetail.coachesIds ${JSON.stringify(userDetail.coachesIds)}`);
          userDetailPromise.push(usrService.usersDetail({userIds: userDetail.coachesIds}));
        }

        if (userDetailPromise.length > 0) {
          return Promise.all(userDetailPromise);
        } else {
          return null;
        }
      } else {
        throw exceptions.userNotFound();
      }
    }).then(function (result) {

      let userInfo = this.userInfo;
      if (_.isEmpty(result)) {
        return {userInfo};
      }

      console.log(`result ${JSON.stringify(result)}`);
      let isSales = false;
      let isManagers = false;
      if (userInfo.salesIds && userInfo.salesIds.length > 0) {
        isSales = true;
        userInfo.sales = result[0];
      }
      if (userInfo.managersIds && userInfo.managersIds.length > 0) {
        isManagers = true;
        if (isSales) {
          userInfo.managers = result[1];
        } else {
          userInfo.managers = result[0];
        }
      }
      if (userInfo.coachesIds && userInfo.coachesIds.length > 0) {
        if (isManagers && isSales) {
          userInfo.coaches = result[2];
        } else if (isManagers || isSales) {
          userInfo.coaches = result[1];
        } else {
          userInfo.coaches = result[0];
        }
      }
      return {userInfo};
    });
}

function userFactors(filters, options) {
  let {date} = _.pick(filters, ['date']);

  let userFactorListFinal;
  return usrService.userFactors(filters, {pageSize: 'all'})
    .bind({})
    .then(userFactorList => {
      userFactorListFinal = userFactorList;
      let userFactors = userFactorList.userInfo.factors;
      let factorIds = _.map(userFactors, "_id");
      return csfService.getFactorsDetail({factorIds}, options);
    })
    .then(function (factorDetail) {
      console.log(`result factorDetail ${JSON.stringify(factorDetail)}`);
      console.log(`result userFactorListFinal ${JSON.stringify(userFactorListFinal)}`);
      let factorList = [];
      for (let i = 0; i < factorDetail.factorInfo.length; i++) {
        let factor = factorDetail.factorInfo[i];
        _.each(userFactorListFinal.userInfo.factors, function (userFactor) {
          if (userFactor._id === factor._id) {
            let newFactor = {
              _id: factor._id,
              name: factor.name,
              frequency: factor.frequency
            }
            if (userFactor.goal) {
              newFactor.goal = userFactor.goal;
            } else {
              newFactor.goal = factor.goal;
            }

            if (date) {
              let factorValue = [];

              _.each(userFactor.filled, function (item, itemIndex) {
                if (item.date == date) {
                  factorValue.push(item);
                }
              });

              if (factorValue.length > 0) {
                newFactor.filled = factorValue;
              }
            }
            factorList.push(newFactor);
          }
        });
      }

      factorDetail.factorInfo = factorList;
      return factorDetail;
    });
}

/**
 * add new user
 * @param newUserDetails
 */
function addNewUser(newUserDetails) {
  let filters = {_id: newUserDetails.user._id};

  //find detail of current loggedin user
  return usrService.userDetail(filters)

    .then(currentUser => {
      console.log('current user' + JSON.stringify(currentUser))
      /**
       * only chief company users can add users
       */
      if (!currentUser.company.chief)
        throw exceptions.unAuthenticatedAccess(appConstants.MESSAGES.notAuthorisedToAdd);

      /**
       * only "su" can adds admin
       */
      if (!appUtils.hasRole(currentUser, 'su') && newUserDetails.roles.includes('admin'))
        throw exceptions.unauthorizedAccess('You cannot add admins.');

      // check if email already exists
      return usrService.checkEmailAlreadyExist(newUserDetails)
        .bind({})
        .then(function (emailExist) {

          if (emailExist) {
            throw exceptions.userAlreadyExists();
          } else {
            // inherit factors from users, merge all users factors and add factors to new user
            return usrService.mergeFactors(newUserDetails.inheritUserCsfId);
          }
        }).then(function (factorsToInherit) {
          newUserDetails.factors = factorsToInherit.factors;
          let companyInfo = {
            companyId: newUserDetails.companyId,
            companyName: newUserDetails.companyName,
            createdBy: newUserDetails.createdBy,
          };

          if (companyInfo.companyId) {
            companyInfo.companyId = newUserDetails.companyId;
          } else {
            companyInfo.companyName = newUserDetails.companyName;
          }
          return companyService.upsertCompanyByIDName(companyInfo);
        }).then(function (companyDetail) {
          console.log("companyDetail ", JSON.stringify(companyDetail));
          newUserDetails.company = companyDetail;

          // check if a company is not a chief one but executive roles present
          if (companyDetail && !companyDetail.chief
            && _.intersection(newUserDetails.roles, ['su', 'admin', 'coach', 'sales']).length) {
            throw exceptions.validationError(appConstants.MESSAGES.cantSetUpSuchRoles);
          }

          //You\'re not authorized to add users to the Southwestern company if u are not su/admin.
          if (companyDetail && companyDetail.chief && !appUtils.isAdmin(currentUser))
            throw exceptions.unauthorizedAccess(appConstants.MESSAGES.notAuthorisedToAdd);

          if (companyDetail && currentUser.restrictedCompanies.includes(companyDetail._id))
            throw  exceptions.unauthorizedAccess(appConstants.MESSAGES.cantAddUserToRestCompany);

          /**
           * every user has either coach/client role associated to it
           */
          if (!newUserDetails.roles) {
            newUserDetails.roles = [];
          }
          if (companyDetail && companyDetail.chief) {
            newUserDetails.roles.push("coach");
          } else {
            newUserDetails.roles.push("client");
          }

          newUserDetails.roles = _.uniq(newUserDetails.roles);
          return usrService.addNewUser(newUserDetails);
        }).then(function (newCreatedUser) {
          console.log(`send user creation email to ${JSON.stringify(newCreatedUser.emails[0].address)}`);
          emailService.sendUserCreationEmail({
            email: newCreatedUser.emails[0].address,
            profile: newCreatedUser.profile.firstName,
            token: newCreatedUser.services.password.reset.token
          });
          console.log(`newCreatedUser ${JSON.stringify(newCreatedUser)}`);
          this.newCreatedUser = newCreatedUser;
          // assign iSoft Rules to user
          return rulesService.mergeRules(newUserDetails.inheritSoftId);
        }).then(function (rulesToInherit) {
          let newCreatedUser = this.newCreatedUser;
          return rulesService.assignRulesToUser(newCreatedUser._id, rulesToInherit.iSoftRules)
            .then(result => {
              return {message: appConstants.MESSAGES.userCreated, userInfo: {_id: newCreatedUser._id}};
            });
        });
    });
}

function assignedUsers(filters, options) {
  return usrService.getAssignedUsers(filters, options);
}

function assignedISoftRules(filters, options) {
  return rulesService.getUserRules(filters, options);
}

function unAssignISoftRules(filters) {
  return rulesService.unAssignISoftRules(filters)
    .then(function (result) {
      return appConstants.MESSAGES.unAssignedSuccessfully;
    });
}

function unAssignUsers(filters) {
  return usrService.unAssignUsers(filters)
    .then(function (result) {
      return appConstants.MESSAGES.unAssignedSuccessfully;
    });
}

/** update user Details
 * update user
 * @param userDetails
 */
function update(userDetails) {

  let currentUser = userDetails.user;
  //check if email already exist
  return usrService.checkEmailAlreadyExist(userDetails)
    .bind({})
    .then(function (emailExist) {
      if (emailExist) {
        throw exceptions.userAlreadyExists();
      }
      else {

        return companyService.companyDetail({companyId: userDetails.companyId})
          .then(function (companyDetail) {
            if (!companyDetail) {
              throw exceptions.validationError(appConstants.MESSAGES.companyNotFound);
            }
            userDetails.company = companyDetail;

            if (companyDetail && companyDetail.chief && !appUtils.isAdmin(currentUser) && currentUser._id != userDetails._id)
              throw exceptions.unauthorizedAccess('You cannot add users to Southwestern.');

            if (!_.includes(userDetails.roles, ['su', 'admin'])) {
              /**
               * every user has either coach/client role associated to it
               */
              if (!userDetails.roles) {
                userDetails.roles = [];
              }

              if (companyDetail && companyDetail.chief) {
                userDetails.roles.push("coach");
              } else {
                userDetails.roles.push("client");
              }

              userDetails.roles = _.uniq(userDetails.roles);
            }

            return usrService.updateUser(userDetails)
              .then(result => {
                if (result) {
                  return appConstants.MESSAGES.accountUpdated;
                }
                else {
                  return appConstants.MESSAGES.operationUnsuccessful;
                }
              });
          });
      }
    });
}

function inheritFactors(filter) {
  return usrService.mergeFactors(filter.inheritCsfUserId, filter.userId)
    .then(function (factorsToInherit) {
      filter.factors = factorsToInherit.factors;
      return usrService.userInheritCsf(filter)
        .then(function (result) {
          if (result) {
            return appConstants.MESSAGES.successfullyUpdated;
          }
          else {
            return appConstants.MESSAGES.operationUnsuccessful;

          }
        });
    });
}

function assignManager(filters, options) {
  return usrService.assignManager(filters)
    .then(function (result) {
      console.log(`assign manager result ${JSON.stringify(result)}`);
      if (result.nModified == 0) {
        throw exceptions.managerNotFound();
      }
      return appConstants.MESSAGES.managerAssigned;
    });
}

function inheritRules(filter) {
  return rulesService.mergeRules(filter.inheritRuleUserId, filter.userId)
    .then(function (rulesToInherit) {
      return rulesService.assignRulesToUser(filter.userId, rulesToInherit.iSoftRules)
        .then(result => {
          if (result) {
            return appConstants.MESSAGES.successfullyUpdated;
          }
          else {
            return appConstants.MESSAGES.operationUnsuccessful;

          }
        });
    });
}

function deleteUser(filters) {
  let userId = filters.userId;
  return usrService.getUserById(userId)
    .then(function (userInfo) {
      if (userInfo) {
        // one cannot simply delete super admin
        if (userInfo.roles.includes('su')) {
          throw exceptions.unauthorizedAccess(appConstants.MESSAGES.cantDeletSu);
        }

        // one cannot delete their own account
        if (userInfo._id == filters.user._id) {
          throw exceptions.unauthorizedAccess(appConstants.MESSAGES.cantDeleteSelf);
        }
        filters.companyId = userInfo.company._id;

        return companyService.companyDetail(filters)
          .then(function (companyDetail) {
            if (companyDetail) {

              // non-admins can manage users only from companies created by them

              if (!filters.user.roles.includes('su')
                && (!filters.user.roles.includes('admin'))
                && companyDetail.createdBy !== filters.user._id &&
                companyDetail.salesId !== filters.user._id) {

                throw exceptions.unauthorizedAccess(appConstants.MESSAGES.cantDeleteUser);

              }

              return usrService.deleteUser(filters)
                .then(function (result) {
                  if (result) {
                    console.log(`result ${JSON.stringify(result)}`);
                    return appConstants.MESSAGES.userDeleted;
                  } else {
                    throw exceptions.userNotFound();
                  }
                });
            }
          });
      }
    });
}

/** update user Details
 * update user
 * @param userDetails
 */
function updateMyProfile(userDetails) {

  let currentUser = userDetails.user;
  //check if email already exist
  return usrService.checkEmailAlreadyExist(_.extend(userDetails, {_id: currentUser._id}))
    .bind({})
    .then(function (emailExist) {
      if (emailExist) {
        throw exceptions.userAlreadyExists();
      } else {

        //on su can update company and no one else
        if (appUtils.hasRole(currentUser, 'su')) {
          return companyService.companyDetail({companyId: userDetails.companyId})
            .then(function (companyDetail) {
              if (!companyDetail) {
                throw exceptions.validationError(appConstants.MESSAGES.companyNotFound);
              }
              userDetails.company = companyDetail;
              return _updateProfile(userDetails);

            });
        } else {
          return _updateProfile(userDetails);
        }
      }
    });
}

function _updateProfile(userDetails) {
  if (!userDetails.roles) {
    userDetails.roles = [];
  }

  return usrService.updateMyProfile(userDetails)
    .then(result => {
      if (result) {
        return appConstants.MESSAGES.accountUpdated;
      }
      else {
        return appConstants.MESSAGES.operationUnsuccessful;
      }
    });

}

//========================== Export Module Start ===========================

module.exports = {
  login,
  listUsers,
  getSalesPersons,
  isChiefUser,
  disableUser,
  assignVisibleCompanies,
  addNewUser,
  userDetail,
  getCoaches,
  userFactors,
  assignedISoftRules,
  inheritFactors,
  assignedUsers,
  unAssignISoftRules,
  update,
  assignManager, inheritRules, deleteUser, updateMyProfile, unAssignUsers
}
;

//========================== Export module end ==================================
