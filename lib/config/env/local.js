'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class LocalConfig extends DefaultConfig {
  constructor() {
    super();

    // override dev property
    this.TAG = "local";
    // All dbs config under this key
    this.dbConfig = {
      // MongoDB connection configs
      mongoDB: {
        dbName: "prateek",
        get dbUrl() {
          return `mongodb://localhost:27017/${this.dbName}`;
        },
        options: {
          //user: "meteor", pass: "meteor",
          server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
          replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
        }
      },
      // RedisDB connection configs
      redisDB: {
        redisDBIndex: 3,
        port: 6379,
        host: "127.0.0.1"
      }
    };
  }
}

//========================== Class Definitions End =======================

module.exports = LocalConfig;
