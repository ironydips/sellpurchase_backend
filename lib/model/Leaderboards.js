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

var leaderboardsSchema = new Schema(
  {
    _id: {
      type: String
    },
    name: {
      type: String,
    },
    showLeaders: {
      type: Boolean,
      optional: true
    },
    leaderCount: {
      type: Number
    },
    categories: [{type: String}]
    ,
    factorsFilter: [{type: String}]
    ,
    period: {
      type: String
    },
    company: {
      type: String
    },
    breakLevel: {
      type: String
    },
    order: {
      type: String
    },

    frequency: {
      type: String,
      allowedValues: {
        enum: [
          'daily',
          'weekly',
          'monthly',
          'quarterly',
          'annually'
        ]
      },
      defaultValue: 'daily'
    },
    day: {
      type: String
    },
    time: {
      type: String
    },
    receivers: {
      type: String
    },
    others: [{type: String}],
    from: {
      type: String
    },
    to: {
      type: String
    },
    offset: {
      type: String
    },
    creator: {
      type: String
    }
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  });


leaderboardsSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

leaderboardsSchema.pre("save", function (next) {
  this._id = mongoose.Types.ObjectId().toString();
  next();
});

module.exports = mongoose.model('leaderboard', leaderboardsSchema, "leaderboards");
