"use strict";

/**
 * Report
 *
 * @module      :: Model
 * @description :: Represent data model for the Report
 */

//========================== Load Modules Start ==========================

//========================== Load External Modules ==========================

let mongoose = require('mongoose');

//========================== Load Internal Modules ==========================

//========================== Load Modules End ==========================

let Schema = mongoose.Schema;

/**
 * Report Schema
 */
const reportSchema = new Schema({
  _id: {
    type: String,
    trim: true
  },
  categories: [
    {
      type: String,
      trim: true
    }
  ],
  companies: [
    {
      type: String,
      trim: true
    }
  ],
  comparisonPeriods: {
    type: Number
  },
  creator: {
    type: String,
    trim: true
  },
  factors: [{
    _id: {
      type: String,
      trim: true
    }
  }],
  frequency: {
    type: String,
    trim: true
  },
  includeManagerStats: {
    type: Boolean,
    default: false
  },
  level: String,
  name: String,
  "not-assigned": Boolean,
  offSet: Number,
  period: String,
  periodDays: Number,
  points: [{
    _id: {
      type: String,
      trim: true
    }
  }],
  receivers: [
    {
      type: String
    }
  ],
  showComparison: {
    type: Boolean,
    default: false
  },
  showGoals: {
    type: Boolean,
    default: false
  },
  showPercentage: {
    type: Boolean,
    default: false
  },
  showSubmitted: {
    type: Boolean,
    default: false
  },
  teams: [],
  time: String,
  "to-coaches": {
    type: Boolean,
    default: false
  },
  "to-managers": {
    type: Boolean,
    default: false
  },
  "to-sales": {
    type: Boolean,
    default: false
  },
  "to-team-members": {
    type: Boolean,
    default: false
  },
  users: [
    {
      type: String
    }
  ],
  viewMode: String
});


module.exports = mongoose.model('report', reportSchema, "reports");
