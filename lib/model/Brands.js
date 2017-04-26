/**
 */
"use strict";

/**
 * Brands
 *
 * @module      :: Model
 * @description :: Represent data model for the Companies
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require("mongoose");

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * Company Schema
 */
var brandSchema = new Schema(
  {
    brandName: {
      type: String,
      unique: true,
      required: true
    },
    variants:[{
      name: {
        type: String
      },
      createdOn: {
        type: Date
      }
    }],
    createdOn:{
      type: Date,
      default: new Date()
    },
    createdBy: {
      type: String,
        default: 'Admin'
    }
  },
  {
    versionKey: false
  }
);

brandSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.createdBy;
  return obj;
};

brandSchema.pre("save", function (next) {
  this.createdOn = new Date();
  next();
});

module.exports = mongoose.model("brands", brandSchema, "brands");
