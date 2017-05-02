/**
 */
/**
 */
"use strict";

/**
 * Purchase Order
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
 * Purchase Orders Schema
 */
var purchaseOrderSchema = new Schema(
    {
        purchaserName:{
          type: String,
          default: String.EMPTY
        },
        purchaserID: {
          type: Schema.ObjectId,
          required: true
        },
        totalItems: {
          type: Number,
          default: 0
        },
        previousBalance:{
          type: Number,
          default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        amountPaid: {
            type: Number,
            required: true
        },
        currentBalance: {
            type: Number,
            default: 0
        },
        isReturned: {
            type: Boolean,
            default: false
        },
        paidBy: [new Schema({
            name : {
                type: String
            },
            amount: {
                type: Number,
                default: 0
            }
        },
        {
            _id: false
        })],
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

purchaseOrderSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.createdBy;
    return obj;
};

purchaseOrderSchema.pre("save", function (next) {
  this.createdOn = new Date();
  next();
});

module.exports = mongoose.model("purchaseOrders", purchaseOrderSchema, "purchaseOrders");
