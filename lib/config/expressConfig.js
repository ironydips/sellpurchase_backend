"use strict";

//===============================Load Modules Start========================

const express = require("express");
const bodyParser = require("body-parser");//parses information from POST
const appUtils = require("../appUtils");

module.exports = function (app, env) {

// parses application/json bodies
  app.use(bodyParser.json());
// use queryString lib to parse urlencoded bodies
// parses application/x-www-form-urlencoded bodies
  app.use(bodyParser.urlencoded({extended: false}));

  if (!app.locals.rootDir) {
    // throw error
  }
  app.use(function (req, res, next) {
    appUtils.setHeadersForCrossDomainIssues(res);
    next();
  });
  /**
   * add swagger to our project
   */
  app.use('/apiDocs', express.static(app.locals.rootDir + '/public/dist'));
}
;
