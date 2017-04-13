/**
 * Created by tushar on 17/12/16.
 */
"use strict";

/**
 * Nationals
 *
 * @module      :: Model
 * @description :: Represent data model for the Nationals
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require('mongoose');

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * National Schema
 */
var nationalSchema = new Schema(
  {
    _id: {
      type: String
    },
    profile: {
      name: {
        type: String,
        required: true
      },
      sales: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zip: {
        type: String,
      },
      country: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      },
      notes: {
        type: String,
      },
      phone: {
        type: String,
        trim: true,
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

nationalSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.createdAt;
  return obj;
};

nationalSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});


module.exports = mongoose.model('nationals', nationalSchema, "nationals");
