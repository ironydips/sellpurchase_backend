"use strict"

/**
 * All Db's connection is handle via this manager.
 * @type {*}
 */
//=================================== Load Modules start ===================================

//=================================== Load external modules=================================
const mongoose = require('mongoose');

//Import logger
// const logger = require("../logger");
// plugin bluebird promise in mongoose
mongoose.Promise = require('bluebird');

//=================================== Load Modules end =====================================


// Connect to Db
function connectDb(env, callback) {
  const dbName = env.dbConfig.mongoDB.dbName;
  const dbUrl = env.dbConfig.mongoDB.dbUrl;
  const dbOptions = env.dbConfig.mongoDB.options;
  if (env.isProd) {
    console.log("configuring db in " + env.TAG + " mode");
  } else {
    console.log("configuring db in " + env.TAG + " mode");
    mongoose.set('debug', true);
  }

  // console.log("connecting to -> " + dbUrl);
  mongoose.connect(dbUrl, dbOptions);

  // CONNECTION EVENTS

  // When successfully connected
  mongoose.connection.on('connected', function () {
    console.log('connected to DB', dbName, 'at', dbUrl);
    callback();
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.log('DB connection error: ' + err);
    callback(err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('DB connection disconnected');
    callback("DB connection disconnected");
  });

}

module.exports = {
  connectDb
};
