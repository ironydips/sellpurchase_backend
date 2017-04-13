/**
 * Created by madhukar on 6/1/17.
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

var factorCategorieSchema = new Schema(
  {
    _id: {
      type: String
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

factorCategorieSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

factorCategorieSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});

module.exports = mongoose.model('factorCategorie', factorCategorieSchema, "factorCategories");
