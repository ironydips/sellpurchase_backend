    "use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const csfRoutr = require("express").Router();

//========================== Load internal modules ====================


//========================== Load Modules End ==============================================
// Load log facade
const csfFacade = require('../facade/csfFacade');
const factorCategorieFacade = require('../facade/factorCategorieFacade');
const resHndlr = require('../resHandler');
const middleware = require("../middleware");
const _ = require('lodash');


//========================== Define Routes Start ==============================================
/**
 * {"userId" : "5XQAcZ4cDwY8XGHyg" , "factorId" : "aMtaHYdWp6bWZ4rh9" ,  "factorName" : "factorNameaaa" , "factorValue" : "7" , "csfDate" : "07/30/2016"
}
 */
csfRoutr.route("/submit")
  .post([middleware.authentication.autntctTkn], middleware.validators.validateCsfSubmit, function (req, res) {
    let csfData = _.pick(req.body, ['userId', 'factorId', 'factorValue', 'csfDate', "factorName", "oldValue"]);
    csfData.loggedInUserId = req.user._id;
    csfFacade.submitCSFData(csfData)
      .then(function (result) {
        resHndlr.sendSuccessWithMsg(res, "CSF submitted successfylly.");
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });


csfRoutr.route("/edit")
  .post([middleware.authentication.autntctTkn], middleware.validators.validateCsfEdit, function (req, res) {
    let csfData = _.pick(req.body, ['userId', 'factorId', 'factorValue', 'csfDate', "factorName", "oldValue"]);
    csfData.loggedInUserId = "5XQAcZ4cDwY8XGHyg";//req.user._id;
    csfFacade.editCSFData(csfData)
      .then(function (result) {
        resHndlr.sendSuccess(res);
      })
      .catch(function (err) {
        resHndlr.sendError(res, err);
      });
  });


csfRoutr.route("/add")
  .post([middleware.authentication.autntctTkn ],middleware.validators.validateCsfAdd,
    function (req, res) {
      let csfData = _.pick(req.body, ['csfCategory', 'csfFrequency', 'csfType', 'csfName', 'csfGoal', "csfLimit", "isCreateNewCSF", "isSharable", "csfCurrency" ,'userIds' ,'addAssign' ]);
      csfData.userId = req.user._id;
      csfFacade.addCSF(csfData)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res , "CSF added successfully.");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

// for assign user
/**
 * assignedObj = [{"8NfSnKX4ct6Eubyo4" : "ggg" , "goal" : 11} , {"8LTcRyJHycwvKnJ5z" : "ggg" , "goal" : 12}]
 unassignedObj = ["WSKk4zEsz6cvajv5b" , "YfCsQWYXCTZYtfFun"]
 userId = {"5XQAcZ4cDwY8XGHyg"
 */
csfRoutr.route("/assign")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let assignData = _.pick(req.body, ['assignedObj', 'unassignedObj', 'userId']);
      csfFacade.assignFactor(assignData)
        .then(function (result) {
          resHndlr.sendSuccess(res);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });

//  not in usee
csfRoutr.route("/unassign")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let unAssignData = _.pick(req.body, ['csfFactorIds', 'userId']);
      csfFacade.unAssignFactor(unAssignData)
        .then(function (result) {
          resHndlr.sendSuccessWithMsg(res , "CSF unassigned successfully.");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


csfRoutr.route("/factors/new")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let userId = req.query.userId;
      return factorCategorieFacade.newFactor()
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


csfRoutr.route("/user/:userId/factors")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['search']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);
      let userId = req.params.userId;

      return csfFacade.listFactors(userId, filters, options)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });

csfRoutr.route("/factors")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['search', 'companyId', 'categoryId']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);
      //let userId = req.params.userId;

      return csfFacade.getCsf(filters, options)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });


csfRoutr.route("/category/list")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let filters = _.pick(req.query, ['search']);
      let options = _.pick(req.query, ['sortBy', 'sortOrder', 'pageNo', 'pageSize']);
      return csfFacade.getCategories(filters, options)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });

csfRoutr.route("/factor/remove")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let factorId = req.body.csfFactorId;
      return csfFacade.removeCsf(factorId)
        .then(function (data) {
          resHndlr.sendSuccessWithMsg(res, "Factor removed successfully");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });
    });


csfRoutr.route("/factors/:factorId")
  .get([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su", "coach"])],
    function (req, res) {
      let factorId = req.params.factorId;
      return csfFacade.getCsfById(factorId)
        .then(function (data) {
          resHndlr.sendSuccess(res, data);
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });


csfRoutr.route("/category/add")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let categoryName = req.body.categoryName;
      return csfFacade.createCategory(categoryName)
        .then(function (data) {
          resHndlr.sendSuccessWithMsg(res, "Category successfully created. ");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });

csfRoutr.route("/category/edit")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let categoryName = req.body.categoryName;
      let cId = req.body.categoryId;
      return csfFacade.editCategory(cId ,categoryName)
        .then(function (data) {
          resHndlr.sendSuccessWithMsg(res, "Category updated successfully.");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });


csfRoutr.route("/category/remove")
  .post([middleware.authentication.autntctTkn, middleware.authorization.companyListing(["admin", "su"])],
    function (req, res) {
      let cId = req.body.categoryId;
      return csfFacade.removeCategory(cId)
        .then(function (data) {
          resHndlr.sendSuccessWithMsg(res, "Category removed successfully.");
        })
        .catch(function (err) {
          resHndlr.sendError(res, err);
        });

    });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = csfRoutr;

//========================== Export Module End ===============================
