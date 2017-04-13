/*Csf backend Start Script*/
// Import Config
const config = require('_/config');
// Import logger
// const logger = require('_/logger');

config.dbMngr.connectDb(config.env, (err, result) => {
  if (err) {
    console.log("error connecting DB.");
    // logger.error(err, 'exiting the app.');
    return;
  }

  // load external modules
  const express = require("express");

  // init express app
  const app = express();

  // set server home directory
  app.locals.rootDir = __dirname;

  // config express
  config.expressConfig(app, config.env);

  // attach the routes to the app
  require("_/routes")(app);

  // start server
  app.listen(config.env.appPort, () => {
    console.log(`Express server listening on ${config.env.appPort}, in ${config.env.TAG} mode`);
  });
});
