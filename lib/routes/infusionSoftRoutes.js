"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");
const iSoftRoutr = require("express").Router();

//========================== Load internal modules ====================

const resHndlr = require('../resHandler');
const Email = require("../facade/emailFacade");
const iSoftFacade = require("../facade/iSoftFacade");

//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================

iSoftRoutr.route("/user/create")
  .post(function (req, res) {
    let {
      infusionId, email, firstName, lastName, cmpnyName,
      cchSoldBy, cchCoachedBy, phone, timeZone
    } = req.body;

    // ToDo: Move error checking to validators
    if (cchSoldBy) {
      cchSoldBy = cchSoldBy.replace(",", "");
      req.body.cchSoldBy = cchSoldBy;
    }
    if (cchCoachedBy) {
      cchCoachedBy = cchCoachedBy.replace(",", "");
      req.body.cchCoachedBy = cchCoachedBy;
    }
    if (infusionId) {
      infusionId = infusionId.replace(",", "");
      req.body.infusionId = infusionId;
    }

    console.log("req =", req.body);
    let msg = [];
    if (!infusionId) {
      msg.push("Infusion soft id not present.");
    }
    if (!email) {
      msg.push("Email Address not present.");
    }
    if (!firstName) {
      msg.push("First name not present.");
    }
    if (!lastName) {
      msg.push("Last name not present.");
    }
    if (!cmpnyName) {
      msg.push("Company name not present.");
    }

    if (msg.length > 0) {
      Email.sendErrorEmail(msg, req.body);
      return resHndlr.sendError(res, {message: msg, params: req.body});
    }

    // If Coaching Sold By supplied, check InfusionSoftId against CSF system…
    // if not found…or found and User is not in Southwestern Company…send Error email
    let salesId;
    if (cchSoldBy) {
      let userInfo = iSoftFacade.findUserByISoftId(cchSoldBy);
      if (_.isEmpty(userInfo)) {
        // push error msgs
        msg.push("Infusion soft id of user(coaching sold by) is not present in CSF system");
      } else if (userInfo.company.chief !== true) {
        msg.push("Infusion soft id of user(coaching sold by) is present in CSF system. " +
          "But is not the chief company user.");
      } else {
        salesId = userInfo._id;
      }
    }

    console.log("sales id of user =", salesId);

    // If Coaching Coached By supplied, check InfusionSoftId against CSF system…
    // if not found…or found and User is not in Southwestern Company, send Error email
    let coachId;
    if (cchCoachedBy) {
      let userInfo = iSoftFacade.findUserByISoftId(cchCoachedBy);
      if (_.isEmpty(userInfo)) {
        // append error msg
        msg.push("Infusion soft id of user(coaching coached by) is not present in CSF system");
      } else if (userInfo.company.chief !== true) {
        msg.push("Infusion soft id of user(coaching coached by) is present in CSF system. " +
          "But is not the chief company user.");
      } else {
        coachId = userInfo._id;
      }
    }

    console.log("coach Id of user =", coachId);

    let usersInfo = iSoftFacade.findUserByEmailIdAndISoftId(email, infusionId);
    //  if 2 users than email and infusion soft id associated with different users
    if (usersInfo && usersInfo.length == 2) {
      msg.push("Infusion soft id and email of user are connected with different users.");
    } else if (usersInfo && usersInfo.length == 1) {
      usersInfo = usersInfo[0];
      // user should have same email address as passed one
      if (usersInfo.emails[0].address !== email) {
        msg.push("User with this email id of user not present, " +
          "but infusion soft id attached to some other user.");
      }

      // if user infusion soft id exist and is not equal to passed id
      if (usersInfo.infusionId && usersInfo.infusionId !== infusionId) {
        msg.push("Some other infusion soft id is already set to this user");
      }

      if (usersInfo.profile.lastName && usersInfo.profile.lastName.toLowerCase() !== lastName.toLowerCase()) {
        msg.push("Infusion soft id and email id valid but user last name not matched.");
      }
    }

    if (msg.length > 0) {
      Email.sendErrorEmail(msg);
      return res.end(JSON.stringify({message: msg, params: req.body}));
    }


    // All error checking passed, perform business logic
    var cmpnyInfo = iSoftFacade.findCmpnyByName(cmpnyName);
    if (!cmpnyInfo) {
      cmpnyInfo = iSoftFacade.addCmpnyByNameFromISoft({name: cmpnyName});
    }

    usersInfo = iSoftFacade.findUserByEmailId(email);

    // Hardcoded for the time being
    timeZone = "US/Central";
    if (usersInfo) {
      let iSoftInfo = {
        email, firstName, lastName, cchSoldBy, cchCoachedBy,
        phone, timeZone, company: cmpnyInfo, salesId, coachId
      };

      // if user doesn't have iSoft id then update
      if (!usersInfo.infusionId) {
        iSoftInfo.infusionId = infusionId;
      }
      usersInfo = iSoftFacade.updateUserFromISoft(iSoftInfo);
      msg = "User updated successfully";
    } else {
      usersInfo = iSoftFacade.addUserFromISoft({
        email, firstName, lastName, cchSoldBy, cchCoachedBy,
        infusionId: infusionId, phone, timeZone, company: cmpnyInfo, salesId, coachId
      });
      msg = "User created successfully";
    }
    res.end(JSON.stringify({status: 1, msg: msg}));
  });

iSoftRoutr.route('/user/disabled')
  .post(function (req, res) {
    let {
      infusionId
    } = req.body;

    // ToDo: Move error checking to validators
    if (infusionId) {
      infusionId = infusionId.replace(",", "");
      req.body.infusionId = infusionId;
    }
    console.log("req =", req.body);

    let msg = [];
    if (!infusionId) {
      msg.push("Infusion soft id not present");
    }

    if (msg.length > 0) {
      Email.sendErrorEmail(msg);
      return res.end(JSON.stringify({message: msg, params: req.body}));
    }

    iSoftFacade.disableUserFromISoft(infusionId)
      .then(function (userInfo) {
        resHndlr.sendSuccess(res, userInfo);
      })
      .catch(function (err) {
        if (err.errorCode) {
          Email.sendErrorEmail(err.msg);
        }
        resHndlr.sendError(res, err);
      });
  });


//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = iSoftRoutr;

//========================== Export Module End ===============================
