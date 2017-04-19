/**
 */

/**
 */
"use strict";

/**
 * Stocks
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
 * Stock Schema
 */
var stockSchema = new Schema(
    {
        brandName: {
            type: String,
            required: true
        },
        variantName:{
            type: String,
            required: true
        },
        availableQty:{
            type: Number,
            default : 0
        },
        qtyOnRecords:{
            type: Number,
            default : 0
        },
        avgBuy: {
            type: Number,
            default : 0
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

stockSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.createdBy;
    return obj;
};

// stockSchema.pre("save", function (next) {
//   this._id = mongoose.Types.ObjectId().toString();
//   next();
// });

module.exports = mongoose.model("stocks", stockSchema, "stocks");
