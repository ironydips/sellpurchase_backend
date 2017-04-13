/**
 * Created by tushar on 17/12/16.
 */
//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load user routes
const adminRouter = require('./adminRoutes');

// Load company routes
const companyRouter = require('./adminRoutes');

// Load CSF routes
const csfRouter = require('./csfRoutes');

// Load authentication routes
const authenticationRouter = require('./authenticationRoutes');

// Load leaderboard routes
const leaderboardRouter = require('./leaderboardRoutes');

// Load member routes
const memberRouter = require('./memberRoutes');

// Load national routes
const nationalRouter = require('./nationalRoutes');

// Load point routes
const pointRouter = require('./pointRoutes');

// Load report routes
const reportRouter = require('./reportRoutes');

// Load rule routes
const ruleRouter = require('./ruleRoutes');

// Load team routes
const teamRouter = require('./teamRoutes');

// Log routes
const logRouter = require('./logRoutes');

// Email routes
const emailRouter = require('./emailRoutes');

//
// Load response module
const resHndlr = require('../resHandler');

//========================== Load Modules End ==============================================

//========================== Export Module Start ==============================

module.exports = function (app) {
  // Attach User Routes
  app.use('/api/admin', adminRouter);

  // Attach Company Routes
  app.use('/csf/api/:version/companies', companyRouter);

  // Attach csf Routes
  app.use('/csf/api/:version/csf', csfRouter);

  // Attach authentication Routes
  app.use('/csf/api/:version/auth', authenticationRouter);

  // Attach User Routes
  app.use('/csf/api/:version/leaderboard', leaderboardRouter);

  // Attach member Routes
  app.use('/csf/api/:version/member', memberRouter);

  // Attach national Routes
  app.use('/csf/api/:version/nationals', nationalRouter);

  // Attach point Routes
  app.use('/csf/api/:version/point', pointRouter);

  // Attach report Routes
  app.use('/csf/api/:version/report', reportRouter);

  // Attach rule Routes
  app.use('/csf/api/:version/rule', ruleRouter);

  // Attach team Routes
  app.use('/csf/api/:version/team', teamRouter);

  // Attach team Routes
  app.use('/csf/api/:version/iSoft', teamRouter);

  // Attach log Routes
  app.use('/csf/api/:version/audit', logRouter);

  // Attach email Routes
  app.use('/csf/api/:version/email', emailRouter);

  // Attach leader Routes
  app.use('/csf/api/:version/leadersboard', emailRouter);

  // Add routes above error handler
  // Attach ErrorHandler to Handle All Errors
  app.use(resHndlr.hndlError);
  console.log("routes attached");
};

//========================== Export Module End ===============================
