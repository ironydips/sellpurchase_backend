/**
 */
"use strict";

/**
 * Purchasers
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
 * Purchasers Schema
 */
var purchaserSchema = new Schema(
  {
    profile: {
      name: {
        type: String,
        required: true,
        unique: true
      },
      address: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      },
      phone: {
          type: Array,
          default: []
      }
    },
    notes:{
        type: String,
        default: String.EMPTY
    },
    balance:{
      type: Number,
      default: 0
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

purchaserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.createdAt;
  return obj;
};

//
// purchaserSchema.pre("save", function (next) {
//   this._id = mongoose.Types.ObjectId().toString();
//   next();
// });


module.exports = mongoose.model('purchasers', purchaserSchema, "purchasers");
