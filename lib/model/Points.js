"use strict";

/**
 * User
 *
 * @module      :: Model
 * @description :: Represent data model for the Points
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require('mongoose');

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * Points Schema
 */
var pointsSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    type: {
      type: String
    },
    flow: [
      {
        type: String
      }
    ]
  },
  {
    versionKey: false
  }
);

pointsSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});


module.exports = mongoose.model('point', pointsSchema, "points");
