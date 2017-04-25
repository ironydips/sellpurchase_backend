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
const stockRouter = require('./stockRoutes');

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

  // Attach order Routes
  app.use('/api/order', orderRouter);

  // Attach stock Routes
  app.use('/api/stock', stockRouter);

  // Add routes above error handler
  // Attach ErrorHandler to Handle All Errors
  app.use(resHndlr.hndlError);
  console.log("routes attached");
};

//========================== Export Module End ===============================
