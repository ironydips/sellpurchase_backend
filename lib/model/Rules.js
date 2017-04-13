"use strict";

/**
 * User
 *
 * @module      :: Model
 * @description :: Represent data model for the Users
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require('mongoose');

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * rules Schema
 */
var rulesSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true
    },
    companies: [
      {
        type: String,
        trim: true
      }
    ],
    conditions: {
      factor: String,
      operator: String,
      value: Number
    }
    ,
    creator: String,
    duration: Number,
    global: Boolean,
    interval: {
      frequency: String,
      day: Number,
      time: String

    },
    multiplier: Number,
    name: String,
    ran: {
      type: Date,
      default: Date.now
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    users: [
      {
        type: String,
        trim: true
      }
    ]

  },
  {
    versionKey: false
  }
  )
  ;

rulesSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.isVerified;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  return obj;
};

rulesSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});


module.exports = mongoose.model('rules', rulesSchema, "rules");
