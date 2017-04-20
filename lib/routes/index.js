/**
 * Created by tushar on 17/12/16.
 */
//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load admin routes
const adminRouter = require('./adminRoutes');

// Load purchase routes
const purchaseRouter = require('./purchaseRoutes');

// Load order routes
const orderRouter = require('./orderRoutes');

// Load authentication routes
const authenticationRouter = require('./purchaseRoutes');

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
const ruleRouter = require('./orderRoutes');

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
  // Attach Admin Routes
  app.use('/api/admin', adminRouter);

  // Attach Purchaser Routes
  app.use('/api/purchaser', purchaseRouter);

  // Attach csf Routes
  app.use('/api/order', orderRouter);

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
