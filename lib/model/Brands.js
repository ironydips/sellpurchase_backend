/**
 * Created by tushar on 17/12/16.
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
      default:Date.now()
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

// companySchema.pre("save", function (next) {
//   this._id = mongoose.Types.ObjectId().toString();
//   next();
// });

module.exports = mongoose.model("brands", brandSchema, "brands");
