/**
 * Created by madhukar on 2/1/17.
 */
"use strict";

/**
 * Companies
 *
 * @module      :: Model
 * @description :: Represent data model for the Logs
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require("mongoose");

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

var logSchema = new Schema(
  {
    _id: {
      type: String
    },
    who: {
      _id: {
        type: String,
        ref: 'String'
      },
      name: {
        type: String,
        required: true
      }
    },
    whom: {
      _id: {
        type: String,
        ref: 'String'
      },
      name: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      }
    },
    When: {
      type: Date
    },
    factor: {
      type: String
    },
    old: {
      type: String
    },
    submitDate: {
      type: Date
    },
    new: {
      type: String
    }
  }
);

logSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

logSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});

module.exports = mongoose.model('log', logSchema, "logs");
