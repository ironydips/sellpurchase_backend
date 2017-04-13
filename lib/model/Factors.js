/**
 * Created by tushar on 17/12/16.
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

var factorSchema = new Schema(
  {
    _id: {
      type: String
    },
    name: {
      type: String,
    },
    type: {
      type: {
        enum: [
          "number",
          "currency",
          "time"
        ]
      }
    },
    // required only when factor type is set to 'currency'
    value: {
      type: String,
      optional: true,
      allowedValues: [
        "dollar",
        "euro",
        "pound",
        "singapore dollar",
        "peso",
        "koruna",
        "australian dollar"
      ],
      custom: function () {
        if (this.field("name").value === "currency" && !_.contains(this.allowedValues, this.value))
          return "required";
      }
    },
    goal: {
      type: Number,
      decimal: true,
      optional: true,
      autoValue: function () {
        return this.value && +this.value.toFixed(6);
      }
    },
    frequency: {
      type: String,
      allowedValues: {
        enum: [
          "daily",
          "weekly",
          "monthly",
          "quarterly",
          "annually"
        ]
      },
      defaultValue: "daily"
    },
    category: {
      type: String,
    },
    global: {
      type: Boolean,
      optional: true
    },
    creator: {
      type: String,
    },
    limit: {
      type: Number,
      optional: true
    }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  });


factorSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

factorSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});

module.exports = mongoose.model("factor", factorSchema, "factors");
