"use strict";

//========================== Load Modules Start =======================

const _ = require('lodash');
const usrRoutr = require("express").Router();

//========================== Load internal modules ====================

const resHndlr = require('../resHandler');
const middleware = require("../middleware");
// Load user facade
const usrFacade = require('../facade/userFacade');

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

const pageSort = ['pageSize', 'pageNo', 'sortBy', 'sortOrder'];

// route for user listing
usrRoutr.route("/list")
  .get([middleware.authentication.autntctTkn], function (req, res) {
    let filters = _.pick(req.query, ['search', 'companyId', 'showAssigned', 'includeDeActivated']);
    let options = _.pick(req.query, pageSort);

    filters.user = req.user;

    usrFacade.listUsers(filters, options)
      .then(function (result) {
        resHndlr.sendSuccess(res, result);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

usrRoutr.route('/salesperson')
  .get([middleware.authentication.autntctTkn], function (req, res) {
    let filters = {};
    let options = _.pick(req.query, pageSort);

    filters.user = req.user;

    usrFacade.getSalesPersons(filters, options)
      .then(function (salesPersonList) {
        resHndlr.sendSuccess(res, salesPersonList);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

usrRoutr.route('/coach')
  .get([middleware.authentication.autntctTkn], function (req, res) {
    let filters = _.pick(req.query, ['search']);
    let options = _.pick(req.query, pageSort);

    filters.user = req.user;

    usrFacade.getCoaches(filters, options)
      .then(function (salesPersonList) {
        resHndlr.sendSuccess(res, salesPersonList);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });

usrRoutr.route('/disable')
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let filters = _.pick(req.body, ['userId', "disable"]);
      filters.user = req.user;

      usrFacade.disableUser(filters)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

usrRoutr.route('/assignVisibleCompanies')
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let filters = _.pick(req.body, ['userId', 'companyId', "assign"]);
      filters.user = req.user;

      usrFacade.assignVisibleCompanies(filters)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * create new user
 */
usrRoutr.route('/create')
  .post([
      middleware.authentication.autntctTkn,
      middleware.authorization.addUser(["su", "admin"]),
      middleware.validators.validateAddUser
    ],
    function (req, res) {
      let newUserDetail = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'timeZone',
        'companyId', 'companyName', 'roles', 'salesPersonIds', 'coachIds', 'managerIds',
        'phone', 'infusionSoftId', 'inheritUserCsfId', 'inheritSoftId']);
      newUserDetail.createdBy = req.user._id;
      newUserDetail.user = req.user;
      usrFacade.addNewUser(newUserDetail)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * get user detail
 */
usrRoutr.route('/detail')
  .post([middleware.authentication.autntctTkn],
    function (req, res) {
      let filters = _.pick(req.body, ['_id']);
      filters.user = req.user;

      usrFacade.userDetail(filters)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * get user assigned CSFs
 */
usrRoutr.route('/factors')
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['userId', 'date']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);
      filters.user = req.user;

      usrFacade.userFactors(filters, options)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * get user's assigned users
 */
usrRoutr.route('/assigned')
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach", "sales", "manager"])],
    function (req, res) {
      let filters = _.pick(req.query, ['userId']);
      filters.user = req.user;
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);

      usrFacade.assignedUsers(filters, options)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * get user's ISoft rules
 */
usrRoutr.route('/rules')
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);
      let filters = _.pick(req.query, ['userId']);
      filters.user = req.user;
      if (!filters.userId) {
        filters.userId = filters.user._id;
      }

      usrFacade.assignedISoftRules(filters, options)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * unassign user's isoft rules
 */
usrRoutr.route('/unassign/isoftRules')
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let filters = _.pick(req.body, ['userId', 'rulesIds']);
      filters.user = req.user;
      if (!filters.userId) {
        filters.userId = filters.user._id;
      }

      usrFacade.unAssignISoftRules(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * assign manger to user
 */
usrRoutr.route('/assign/manager')
  .post(/*[middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],*/
    function (req, res) {
      let filters = _.pick(req.body, ['userIds', 'managerId']);
      filters.user = req.user;

      usrFacade.assignManager(filters)
        .then(function (result) {
          resHndlr.sendSuccess(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * update user
 */
usrRoutr.route('/update')
  .post([
      middleware.authentication.autntctTkn,
      middleware.authorization.userUpdate(["su", "admin", "client", "manager", "coach"]),
      middleware.validators.validateUpdateUser],
    function (req, res) {
      let updateUser = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'timeZone',
        'companyId', 'companyName', 'roles', 'salesPersonIds', 'coachIds', 'managerIds',
        'phone', 'infusionSoftId', '_id']);

      console.log(`updateUser ${JSON.stringify(updateUser)}`);
      usrFacade.update(updateUser)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


usrRoutr.route('/inheritcsf')
  .post([middleware.authentication.autntctTkn, middleware.authorization.userUpdate(["su", "admin", "manager", "coach"]), middleware.validators.validateInheritCsf],
    function (req, res) {
      let filter = _.pick(req.body, ['userId', 'inheritCsfUserId']);
      usrFacade.inheritFactors(filter)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

usrRoutr.route('/inherit_rules')
  .post([middleware.authentication.autntctTkn, middleware.authorization.userUpdate(["su", "admin", "manager", "coach"]), middleware.validators.validateInheritRules],
    function (req, res) {
      let filter = _.pick(req.body, ['userId', 'inheritRuleUserId']);
      usrFacade.inheritRules(filter)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

usrRoutr.route('/delete')
  .post([middleware.authentication.autntctTkn, middleware.authorization.deleteUser(["admin", "su", "manager", "coach"])],
    function (req, res) {
      let filters = _.pick(req.body, ['userId']);
      filters.user = req.user;

      usrFacade.deleteUser(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * update user profile
 */
usrRoutr.route('/update/me')
  .post([
      middleware.authentication.autntctTkn,
      middleware.authorization.updateMyProfile(["su", "admin", "client", "manager", "coach"]),
      middleware.validators.validateUpdateProfile],
    function (req, res) {
      let updateUser = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'timeZone',
        'companyId', 'roles', 'salesPersonIds', 'coachIds', 'managerIds',
        'phone', 'infusionSoftId']);
      updateUser.user = req.user;

      console.log(`updateUser ${JSON.stringify(updateUser)}`);
      usrFacade.updateMyProfile(updateUser)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

/**
 * unassign coach/sales from user
 */
usrRoutr.route('/unassign/user')
  .post([
      middleware.authentication.autntctTkn,
      middleware.authorization.companyListing(["admin", "su"]),
      middleware.validators.unAssignUser],
    function (req, res) {
      let filters = _.pick(req.body, ['userId', 'coachesIds', 'salesIds', 'managersIds']);

      usrFacade.unAssignUsers(filters)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res, result);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

//========================== Define Routes End ===============================

//========================== Export Module Start =============================

module.exports = usrRoutr;

//========================== Export Module End ===============================
