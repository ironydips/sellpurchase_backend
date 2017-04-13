"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

let _ = require("lodash");

//========================== Load internal modules ====================

// Load app constant
const appConst = require('../constants');
// Load base dao
const BaseDao = require('./baseDao');
// Load User Model
const UserModel = require('../model/Users');
const FactorModel = require('../model/Factors')
const appUtils = require('../appUtils');

//========================== Load Modules End ==============================================

const userDao = new BaseDao(UserModel);
const factorDao = new BaseDao(FactorModel);

//Define Projections
const PROJECTION = {
  ALL: {},
  DETAIL: {_id: 1, profile: 1, roles: 1, emails: 1, company: 1, disabled: 1},
  BASIC_PROFILE: {_id: 1, profile: 1},
  PROFILE_EMAIL: {_id: 1, profile: 1, emails: 1},
  FACTOR: {"factors._id": 1, "factors.goal": 1},
  FACTOR1: {"factors._id": 1},
  COMPANY_BASIC_PROFILE: {"company._id": 1, "company.profile": 1},
};

const SORT_BY = {name: 'profile.firstName', email: 'emails.address', company: 'company.profile.name', roles: 'roles'};

function login(email) {
  let query = {'emails.address': email, 'disabled': {$in: [false, null]}};
  let projection = _.extend(PROJECTION.DETAIL, {"services.password.bcrypt": 1});

  return userDao.findOne(query, projection);
}

/**
 * @returns LoggedIn Sessions of Current User
 * @param userId
 * @param callback
 */
function getUserLoginToken(userId, token) {
  // let query = {'_id': userId, 'services.resume.loginTokens': {$elemMatch: {'hashedToken': token}}};
  let query = {'_id': userId, 'services.resume.loginTokens.hashedToken': token};

  return userDao.findOne(query, {_id: 0});
}

function addTokenToUser(userId, token) {
  return getUserLoginToken(userId, token)
    .then(function (user) {
      if (user == null) {
        var update = {$addToSet: {'services.resume.loginTokens': {hashedToken: token}}};
        return userDao.findOneAndUpdate({_id: userId}, update);
      } else {
        return user;
      }
    });
}

function logout(id, token) {
  let query = {'_id': id};
  let update = {$pull: {'services.resume.loginTokens': {hashedToken: token}}};

  return userDao.update(query, update);
}

function deleteCompanyUsers(filters) {
  let query = {'company._id': filters.companyId};

  return userDao.remove(query);
}

function resetPassword({email, randomToken}) {
  let query = {'emails.address': email};
  let updateOption = {$set: {"services.password.reset": {token: randomToken, when: Date.now()}}};

  return userDao.findOneAndUpdate(query, updateOption, {
    new: true, fields: {"services.password.reset.token": 1, profile: 1}
  });
}

function findByISoftId(iSoftId) {
  return userDao.findOne({"infusionId": iSoftId + ""});
}

function disableISoftUser(iSoftId) {
  let query = {"infusionId": iSoftId + ""};
  let docToUpdate = {$set: {disabled: true}};

  return userDao.update(query, docToUpdate);
}

function disableUser(filters, options) {
  let query = {_id: filters.userId};
  console.log("Disable", filters.disable)
  let docToUpdate = {};
  if (filters.disable == 0) {
    docToUpdate = {$unset: {disabled: false}};
  } else {
    docToUpdate = {$set: {disabled: true}};
  }

  console.log(`query ${JSON.stringify(query)}`);
  console.log(`docToUpdate ${JSON.stringify(docToUpdate)}`);
  return userDao.update(query, docToUpdate);
}

/**
 * visible companies can be assigned to, only southwestern managers or same companies managers
 * @param filters
 * @param options
 * @returns {*}
 */
function assignVisibleCompanies(filters, options) {
  // user should be manager
  let query = {roles: "manager"};

  let orQuery = [];
  let swUser = {"_id": filters.userId, "company.chief": true};
  let sameCmpnyUser = {"_id": filters.userId, "company.chief": true};
  // either user is from chief company or from same company
  orQuery.push(swUser);
  orQuery.push(sameCmpnyUser);

  query["$or"] = orQuery;

  let docToUpdate;
  if (filters.assign == 1) {
    docToUpdate = {$addToSet: {visibleCompanies: filters.companyId}};
  } else {
    docToUpdate = {$pull: {visibleCompanies: filters.companyId}};
  }

  return userDao.update(query, docToUpdate);
}

function getUsers(filters = {}, options = {}) {
  let {search, companyId, includeDeActivated, showAssigned = 0, user} = _.pick(filters,
    ['search', 'companyId', 'includeDeActivated', 'showAssigned', 'user']);

  return getUserById(user._id)
    .then(function (user) {
      let query = {};
      let andQuery = [];
      let orSearchQuery = [];
      if (search) {
        var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
        orSearchQuery.push({'profile.firstName': regularExpression});
        orSearchQuery.push({'profile.lastName': regularExpression});
        orSearchQuery.push({'emails.address': regularExpression});
        orSearchQuery.push({'company.profile.name': regularExpression});
        andQuery.push({'$or': orSearchQuery});
      }

      if (companyId) {
        andQuery.push({'company._id': companyId});
      }
      console.log(`includeDeActivated ${includeDeActivated}`);

      if (!includeDeActivated || includeDeActivated == 0) {
        andQuery.push({'disabled': {$in: [false, null]}});
      }

      let orQuery = [];
      _.each(user.roles, function (role, index) {
        console.log(`role ${role} at index ${index}`);
        switch (role) {
          case appConst.ROLES.COACH:
            // if user is coach include users, he coaches
            orQuery.push({coachesIds: user._id});
            break;
          case appConst.ROLES.MANAGER:
            // showAssigned for manager roles only
            if (showAssigned == 0) {
              // show assigned as well as company users he has permissions
              orQuery.push({'company._id': {$in: user.visibleCompanies}});
            }
            // if user is manager include users, he manage
            orQuery.push({managersIds: user._id});
            break;
          case appConst.ROLES.SALES:
            // if user is from sales include users, he sold as sales
            orQuery.push({salesId: user._id});
            break;
        }
      });

      if (orQuery.length > 0) {
        andQuery.push({"$or": orQuery});
      }

      if (andQuery.length > 0) {
        query["$and"] = andQuery;
      }
      console.log(`query user ${JSON.stringify(query)}`);
      options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
      let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
      return Promise.all([userDao.find(query, PROJECTION.DETAIL, sortSkipLimitParams), userDao.count(query)])
        .then(result => {
          return {
            userInfo: result[0],
            pagingInfo: {
              pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
            }
          };
        });
    });
}

function resetNewPassword({password, token}) {
  let query = {'services.password.reset.token': token};
  let pass = appUtils.generateSaltAndHashForPassword(password);
  let update = {$set: {'services.password.bcrypt': pass.hash}, $unset: {'services.password.reset': 1}};
  return userDao.findOneAndUpdate(query, update);
}

function findByToken(token) {
  let query = {'services.password.reset.token': token};
  return userDao.findOne(query);
}

function verifyUserEmail(emailAddress) {
  let query = {'emails.address': emailAddress};
  let updateOption = {$set: {'emails.$.verified': true}};

  return userDao.findOneAndUpdate(query, updateOption);
}

function getUserById(userId, options) {
  let query = {_id: userId};
  let projection = {};
  if (options && options.fields) {
    projection = options.fields;
  }
  return userDao.findOne(query, projection);
}

function getCompanyManagers(filters = {}, options = {}) {
  let {search, companyId, includeChiefManagers} = _.pick(filters, ['search', 'companyId', 'includeChiefManagers']);

  let query = {roles: "manager"};
  let projection = PROJECTION.BASIC_PROFILE;
  if (search) {
    query['profile.firstName'] = search;
  }

  let orQuery = [];
  orQuery.push({'company._id': companyId});

  if (includeChiefManagers == 1) {
    orQuery.push({'company.chief': true});
  }

  query['$or'] = orQuery;

  if (companyId) {
    let userProjection = {"$elemMatch": {"$eq": companyId}};
    projection.visibleCompanies = userProjection;
  }

  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.BASIC_PROFILE;
  }

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function getSalesPersons(filters = {}, options = {}) {
  let {search, user} = _.pick(filters, ['search', 'user']);

  let query = {roles: "sales"};
  let projection = PROJECTION.DETAIL;

  if (search) {
    query['profile.firstName'] = search;
  }

  options.sortBy = options.sortBy ? options.sortBy : 'profile.firstName';
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.BASIC_PROFILE;
  }

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function getCoaches(filters = {}, options = {}) {
  let {search, user} = _.pick(filters, ['search', 'user']);

  let query = {roles: "coach"};
  let projection = PROJECTION.DETAIL;

  if (search) {
    query['profile.firstName'] = search;
  }

  options.sortBy = options.sortBy ? options.sortBy : 'profile.firstName';
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.BASIC_PROFILE;
  }

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit send paging info
    promiseList.push(userDao.count(query));
  }
  return addPagingInfo(promiseList, "userInfo", options);
}

function numberOfUsersInTeam(filters, option) {
  let {teamIds} = _.pick(filters, ['teamIds']);
  let query = [];

  let matchStage = {teamId: {"$in": teamIds}};
  query.push({$match: matchStage});
  let unwindStage = "$teamId";
  query.push({$unwind: unwindStage});
  let teamMatchStage = {teamId: {"$in": teamIds}};
  query.push({$match: teamMatchStage});
  let groupStage = {_id: "$teamId", userCount: {$sum: 1}};
  query.push({"$group": groupStage});

  return userDao.aggregate(query);
}

function addTeamInUserCompany(filters) {
  let query = {'company._id': filters.companyId};
  let docToUpdate = {$push: {"company.teams": {_id: filters.teamId, profile: filters.profile}}};
  let options = {multi: true};

  return userDao.update(query, docToUpdate, options);
}

function updateTeamInUserCompany(filters) {
  let query = {'company._id': filters.companyId, 'company.teams._id': filters.teamId};
  let docToUpdate = {$set: {'company.teams.$.profile': filters.profile}};
  let options = {multi: true};

  return userDao.update(query, docToUpdate, options);
}

function addTeamToMembers(filters) {
  let {teamId, members} = _.pick(filters, ['teamId', 'members']);

  let query = {_id: {$in: members}};
  let docToUpdate = {$addToSet: {teamId: teamId}};
  let options = {multi: true};

  return userDao.update(query, docToUpdate, options);
}

/**
 * remove team members
 * remove team members of a company
 * @param filters
 * @returns {*}
 */
function removeTeamFromMembers(filters) {
  let {teamId, companyId} = _.pick(filters, ['teamId', 'companyId']);

  let query = {teamId: teamId};
  if (companyId) {
    query["company._id"] = companyId;
  }
  let docToUpdate = {$pull: {teamId: teamId}};
  let options = {multi: true};

  return userDao.update(query, docToUpdate, options);
}

function addTeamToManagers(filters) {
  let {teamId, managers} = _.pick(filters, ['teamId', 'managers']);

  let query = {_id: {$in: managers}, roles: "manager"};
  let docToUpdate = {managedTeams: teamId};

  return userDao.update(query, {$addToSet: docToUpdate}, {multi: true});
}

/**
 * remove team managers
 * remove team managers of a company
 * @param filters
 * @returns {*}
 */
function removeTeamFromManagers(filters) {
  let {teamId, companyId} = _.pick(filters, ['teamId', 'companyId']);

  let query = {managedTeams: teamId};
  if (companyId) {
    query["company._id"] = companyId;
  }
  let docToUpdate = {$pull: {managedTeams: teamId}};

  return userDao.update(query, docToUpdate, {multi: true});
}

function addNewUser({
  email, firstName, lastName = "", phone = "", timeZone, createdBy,
  teamId = [], visibleCompanies = [], salesPersonIds = [], coachesIds = [], managerIds = [], factors = [], roles = [],
  company, password, infusionSoftId
}) {
  let newUser = {
    emails: [{
      address: email,
      verified: false
    }],
    profile: {firstName: firstName, lastName: lastName, phone: phone},
    timeZone: timeZone,
    createdBy: createdBy,
    teamId: teamId,
    visibleCompanies: visibleCompanies,
    salesIds: salesPersonIds,
    coachesIds: coachesIds,
    managersIds: managerIds,
    factors: factors,
    roles: roles,
    company: company,
  };

  // set password
  if (!_.isEmpty(password)) {
    let passHash = appUtils.generateSaltAndHashForPassword(password);
    password = passHash.hash;
    newUser.services = {
      password: {
        bcrypt: password,
        reset: {
          token: appUtils.generateResetPwdToken(),
          when: Date.now(),
          email: email

        }
      }
    };
  } else {
    newUser.services = {
      password: {
        reset: {
          token: appUtils.generateResetPwdToken(),
          when: Date.now(),
          email: email

        }
      }
    };
  }
  if (!_.isEmpty(infusionSoftId)) {
    newUser.infusionId = infusionSoftId;
  }

  console.log(`newUser ${JSON.stringify(newUser)}`);
  return userDao.save(newUser);
}

function userDetail(filters) {
  let {_id} = _.pick(filters, ['_id']);

  let query = {_id: _id};
  let projection = {
    profile: 1, emails: 1, timeZone: 1, "company._id": 1, "company.profile.name": 1, roles: 1,
    'company.chief': 1, coaches: 1, coachesIds: 1, salesIds: 1, managersIds: 1, infusionId: 1, restrictedCompanies: 1
  };

  projection = _.extend(PROJECTION.DETAIL, projection);

  delete projection.company;
  return userDao.findOne(query, projection);
}

function usersDetail(filters, options = {}) {
  let query = {};
  if (filters.userIds) {
    query = {_id: {$in: filters.userIds}};
  }
  let projection = PROJECTION.DETAIL;
  if (options.fields) {
    projection = options.fields;
  }
  return userDao.find(query, projection);
}

function usersFactors(filters, options = {}) {
  let {userIds} = _.pick(filters, ['userIds']);

  let query = {_id: {$in: userIds}};
  let projection = PROJECTION.FACTOR;
  if (options.fields) {
    projection = options.fields;
  }

  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.FACTOR;
  }

  console.log(`factors query ${JSON.stringify(query)}`);
  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function userFactors(filters, options = {}) {
  let {userId, date} = _.pick(filters, ['userId', 'date']);

  let query = {_id: userId};
  let projection = PROJECTION.FACTOR;
  if (options.fields) {
    projection = options.fields;
  }

  console.log(`options ${JSON.stringify(options)}`);
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);
  console.log(`sortSkipLimitParams ${JSON.stringify(sortSkipLimitParams)}`);
  // if users requested without limit send minimum info
  if (!sortSkipLimitParams.limit) {
    projection = PROJECTION.FACTOR;
  }

  if (date) {
    projection["factors.filled"] = 1;
  }

  return userDao.findOneLean(query, projection).then(function (result) {
    let response = {};
    if (sortSkipLimitParams.limit) {
      response.pagingInfo = {
        pageNo: options.pageNo,
        pageSize: options.pageSize,
        totalRecords: result && result.factors ? result.factors.length : 0
      };

      if (result && result.factors) {
        result.factors = result.factors.slice(sortSkipLimitParams.skip,
          sortSkipLimitParams.skip + sortSkipLimitParams.limit);
      }
    }
    response.userInfo = result;
    return response;
  });
}

function checkEmailAlreadyExist(params) {
  let query = {};
  if (!_.isEmpty(params._id)) {
    query = {
      $and: [{emails: {$elemMatch: {address: params.email}}},
        {_id: {$ne: params._id}}]
    };
  }
  else {
    query = {emails: {$elemMatch: {address: params.email}}};

  }

  return userDao.findOne(query, PROJECTION.DETAIL);
}

function findFactorByUser(userId) {
  let query = {'_id': userId};
  return userDao.find({'_id': userId}, {"factors": 1});

}

function getAssignedUsers(filters, options) {
  let {userId} = _.pick(filters, ['userId']);
  let query = {$or: [{managerIds: userId}, {coachesIds: userId}, {salesIds: userId}]};
  let projection = PROJECTION.BASIC_PROFILE;

  if (options.fields) {
    projection = options.fields;
  }

  let userProjection = {"$elemMatch": {"$eq": userId}};
  projection.managerIds = projection.coachesIds = projection.salesIds = userProjection;
  console.log(`projection ${JSON.stringify(projection)}`);

  options.sortBy = options.sortBy ? SORT_BY[options.sortBy] : SORT_BY.name;
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function reportUserFactors(filters, options) {
  let {companiesIds, teamsIds, usersIds, breaklevel} = _.pick(filters, ['companiesIds', 'teamsIds', 'usersIds', 'breaklevel']);
  let query = [];

  /*if (companiesIds)
   query['company._id'] = {$in: companiesIds};
   if (teamsIds)
   query.teamId = {$in: teamsIds};
   if (usersIds && usersIds != 'all') {
   query._id = {$in: usersIds};
   }*/
  let matchQuery = {$match: {'company._id': {$in: companiesIds}}};
  let limitUsers = {$limit: 1};
  query.push(matchQuery);
  query.push(limitUsers);

  breaklevel = "company";
  if (breaklevel == "company") {
    /*    let userProject = {
     $project: {
     mappedEntities: {
     $map: {
     input: "$factors",
     as: "factor",
     in: {
     entityId: "$company._id",
     entityName: "$company.profile.name",
     userId: "$_id",
     userFactorId: "$$factor._id",
     userFactorGoals: "$$factor.goal",
     }
     }
     }
     }
     };
     query.push(userProject);*/
    let unwindMappedEntities = {$unwind: "$factors"};
    query.push(unwindMappedEntities);
    let factorProject = {
      $project: {
        _id: "$factors._id",
        entityId: "$company._id",
        entityName: "$company.profile.name",
        userId: "$_id",
        goals: "$factors.goal",
      }
    };
    query.push(factorProject);
  } else if (breaklevel == "team") {
    let userProject = {
      $project: {
        // _id: "$factors._id",
        mappedEntities: {
          $map: {
            input: "$teams",
            as: "team",
            in: {
              entityId: "$team._id",
              entityName: "$team.profile.name",
              userId: "$_id",
            }
          }
        }
      }
    };
    query.push(userProject);

    let unwindfactors = {$unwind: "$mappedEntities"};
    query.push(unwindfactors);

  } else if (breaklevel == "individual") {
    /*let userProject = {
     $project: {
     // _id: "$factors._id",
     mappedEntities: {
     $map: {
     input: "$factors",
     as: "factor",
     in: {
     entityId: "$_id",
     entityName: {$concat: ["$profile.firstName", " ", "$profile.lastName"]},
     userId: "$_id",
     userFactorId: "$$factor._id",
     userFactorGoals: "$$factor.goal",
     }
     }
     }
     }
     };
     query.push(userProject);*/

    let unwindfactors = {$unwind: "$factors"};
    query.push(unwindfactors);

    let factorProject = {
      $project: {
        _id: "$factors._id",
        entityId: "$_id",
        entityName: {$concat: ["$profile.firstName", " ", "$profile.lastName"]},
        userId: "$_id",
        goals: "$factors.goal",
      }
    };
    query.push(factorProject);
  }

  return userDao.aggregate(query);
}


function getCsfIdSByComapny(companyId) {
  var query = {};
  if (companyId) {
    query['company._id'] = companyId;
  }
  //({"company._id":"MBZ6WpDCMCLoGJGqL"} ,{"factors._id" : 1}).pretty()
  if(companyId){
    return userDao.find(query, {"factors._id": 1});
  }else{
    return factorDao.find(query, {"_id": 1});
  }

}

function getCreatorNameMap(userIds) {
  var query = {};
  query._id = {$in: userIds};
  return userDao.find(query, {'_id': 1, 'profile': 1});
}

function getAssignUsersCount(factorId) {
  return userDao.count({"factors": {"$elemMatch": {"_id": factorId}}});
}
function update({
  email, firstName, lastName = "", phone = "", timeZone,
  salesPersonIds, coachesIds, managerIds, roles = [],
  company, password, infusionSoftId, _id
}) {
  let user = {
    profile: {firstName: firstName, lastName: lastName, phone: phone},
    roles: roles,
    company: company
  };

  if (!_.isEmpty(timeZone)) {
    user.timeZone = timeZone;
  }

  user["emails.0.address"] = email;

  if (_.isArray(salesPersonIds)) {
    user.salesIds = salesPersonIds;
  }
  if (_.isArray(managerIds)) {
    user.managersIds = managerIds;
  }
  if (_.isArray(coachesIds)) {
    user.coachesIds = coachesIds;
  }

  // set password
  if (!_.isEmpty(password)) {
    let passHash = appUtils.generateSaltAndHashForPassword(password);
    password = passHash.hash;
    user["services.password.bcrypt"] = password;
  }
  if (!_.isEmpty(infusionSoftId)) {
    user.infusionId = infusionSoftId;
  }

  console.log(`newUser ${JSON.stringify(user)}`);
  let query = {_id: _id};
  let update = {$set: user};

  return userDao.findOneAndUpdate(query, update);
}

function mergeFactorsOnUserBasis(filter) {
  let query = {_id: filter.userId};
  let factors = filter.factors;
  let update = {$addToSet: {factors: {$each: factors}}};

  return userDao.findOneAndUpdate(query, update);

}
function assignManager(filters, options) {
  let query = {_id: filters.managerId, roles: "manager"};
  let docToUpdate = {$addToSet: {managersIds: {$each: filters.userIds}}};
  return userDao.update(query, docToUpdate);
}

function removeCsf(factorId) {
  var query = {};
  var update = {$pull: {"factors": {"_id": factorId}}};
  return userDao.update(query, update, {multi: true});
}

function getGoalByUserAndCSFIds(userId) {
  var Pro = {'factors._id': 1, 'factors.goal': 1};
  var query = {'_id': userId};
  return userDao.find(query, Pro);
}

function getCompanyTeamMembers(filter, options = {}) {
  let {companyId, teamId, search, showSelected}=_.pick(filter, ['search', 'companyId', 'teamId', 'showSelected']);
  let query = {'company._id': companyId};
  let projection = PROJECTION.PROFILE_EMAIL;

  if (showSelected == 1) {
    query["teamId"] = teamId;
  }
  if (search) {
    var regularExpression = new RegExp(appUtils.escapeRegExp(search), 'gi');
    let orSearchQuery = [];
    orSearchQuery.push({'profile.firstName': regularExpression});
    orSearchQuery.push({'profile.lastName': regularExpression});
    orSearchQuery.push({'emails.address': regularExpression});
    query['$or'] = orSearchQuery;
  }

  if (teamId) {
    let userProjection = {"$elemMatch": {"$eq": teamId}};
    projection.teamId = userProjection;
  }
  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function getTeamManagers(filter, options = {}) {
  let {teamId}=_.pick(filter, ['teamId']);
  let query = {managedTeams: teamId};
  let projection = PROJECTION.BASIC_PROFILE;

  let sortSkipLimitParams = appUtils.getSortSkipLimitParams(options);

  let promiseList = [];
  promiseList.push(userDao.find(query, projection, sortSkipLimitParams));
  if (sortSkipLimitParams.limit) {
    // if users requested with limit, send paging info
    promiseList.push(userDao.count(query));
  }

  return addPagingInfo(promiseList, "userInfo", options);
}

function findUserCompany(userId) {
  return userDao.find({"_id": userId}, {"company.profile.name": 1, "profile.firstName": 1, "profile.lastName": 1});
}

function findUserCompanyId(userId) {
  return userDao.findOne({"_id": userId}, {"company._id": 1});
}

function deleteUser(filters) {
  let query = {_id: filters.userId};

  console.log(`query ${JSON.stringify(query)}`);
  return userDao.remove(query);
}

function updateMyProfile({
  email, firstName, lastName = "", phone = "", timeZone,
  salesPersonIds, coachesIds, managerIds, roles = [],
  company, password, infusionSoftId, user
}) {
  let currentUser = user;

  let userInfo = {
    profile: {firstName: firstName, lastName: lastName, phone: phone},
    timeZone: timeZone,
  };

  userInfo["emails.0.address"] = email;
  if (appUtils.hasRole(currentUser, 'su')) {
    userInfo.company = company;
  }

  //only su / admin can update this
  if (appUtils.isAdmin(currentUser)) {
    if (_.isArray(salesPersonIds)) {
      userInfo.salesIds = salesPersonIds;
    }
    if (_.isArray(coachesIds)) {
      userInfo.coachesIds = coachesIds;
    }
    if (roles) {
      userInfo.roles = roles;
    }
    if (!_.isEmpty(infusionSoftId)) {
      userInfo.infusionId = infusionSoftId;
    }
  }

  //only su ,admin ,coach ,manager can set this field
  if (appUtils.hasRole(currentUser, "su|admin|coach|manager")) {
    if (_.isArray(managerIds)) {
      userInfo.managersIds = managerIds;
    }
  }

  // set password
  if (!_.isEmpty(password)) {
    let passHash = appUtils.generateSaltAndHashForPassword(password);
    password = passHash.hash;
    userInfo["services.password.bcrypt"] = password;
  }


  console.log(`user update profile ${JSON.stringify(userInfo)}`);
  let query = {_id: currentUser._id};
  let update = {$set: userInfo};

  return userDao.findOneAndUpdate(query, update);
}


function updateCompanyInUsers(companyDetail) {
  let {_id} = _.pick(companyDetail, ['_id']);

  let query = {"company._id": _id};
  let docToUpdate = {"company": companyDetail};
  let options = {multi: true};

  return userDao.update(query, docToUpdate, options);
}

function unAssignUsers(detail) {
  let {userId, coachesIds, salesIds, managersIds} = _.pick(detail, ['userId', 'coachesIds', 'salesIds', 'managersIds']);

  let query = {_id: userId};
  let usersToPull = {};
  if (coachesIds && coachesIds.length > 0) {
    usersToPull.coachesIds = {$in: coachesIds};
  }
  if (salesIds && salesIds.length > 0) {
    usersToPull.salesIds = {$in: salesIds};
  }
  if (managersIds && managersIds.length > 0) {
    usersToPull.managersIds = {$in: managersIds};
  }

  let docToUpdate = {};
  docToUpdate["$pull"] = usersToPull;
  return userDao.update(query, docToUpdate);
}

//========================== Export Module Start ==================

module.exports = {
  PROJECTION,
  login,
  getUserLoginToken,
  addTokenToUser,
  deleteCompanyUsers,
  logout,
  resetPassword,
  findByISoftId,
  disableISoftUser,
  getUsers,
  resetNewPassword,
  getUserById,
  findByToken,
  verifyUserEmail,
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
  addNewUser,
  getCsfIdSByComapny, getCreatorNameMap, getAssignUsersCount,
  checkEmailAlreadyExist,
  userDetail,
  usersDetail,
  getCoaches,
  userFactors,
  usersFactors,
  getAssignedUsers,
  findFactorByUser,
  mergeFactorsOnUserBasis,
  reportUserFactors,
  update,
  assignManager,
  removeCsf,
  getGoalByUserAndCSFIds,
  getCompanyTeamMembers,
  getTeamManagers,
  findUserCompany,
  findUserCompanyId,
  deleteUser,
  updateCompanyInUsers,
  updateMyProfile,
  unAssignUsers,
};

//========================== Export module end ==================================


function addPagingInfo(promiseList, responseKey, options) {
  return Promise.all(promiseList)
    .then(result => {
      let response = {};
      response[responseKey] = result[0];
      if (result[1]) {
        response.pagingInfo = {
          pageNo: options.pageNo, pageSize: options.pageSize, totalRecords: result[1]
        };
      }

      return response;
    });
}
