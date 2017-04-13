"use strict";

//========================== Class Definitions Start =====================

class DefaultConfig {
  constructor() {
    this.TAG = "local";
    this.isProd = false;
    // Server port
    this.appPort = 3011;
    // Server IP
    this.hostIP = '127.0.0.1';
    this.hostName = 'localhost';
    this.JWT_TOKEN_SECRET = "bf23d39ca08631ea94370d597324338b";

    // All dbs config under this key
    this.dbConfig = {
      // MongoDB connection configs
      mongoDB: {
        dbName: "prateek",
        get dbUrl() {
          return `mongodb://localhost:27017/${this.dbName}`;
        },
        options: {
          // user: "meteor", pass: "meteor",
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

    this.mailConfig = {
      "publicKey": "pubkey-809816e7277c2fbbb693c422111d1d6e",
      "privateKey": "key-a38d44643c01bdcb552877db511a8670",
      "hostname": "email-smtp.us-east-1.amazonaws.com",
      "domain": "swconsulting",
      "domainLogin": "AKIAJNR24VVDYG3XSI3A",
      "domainPassword": "ApRhovB1TG6urk87JzGch8wyLD1Vnj9Cskm4b1ekte1D",
      "port": 465
    };
  }

  getConfigs() {
    return this;
  }
}

//========================== Class Definitions End =====================


//========================== Export module start =======================

module.exports = DefaultConfig;

//========================== Export module end =========================
