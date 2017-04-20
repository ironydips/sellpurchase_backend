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
        refID: {
            type: Schema.ObjectId
        },
        paidBy: [{
            name : {
                type: String
            },
            amount: {
                type: Number,
                default: 0
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

purchaseOrderSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.createdBy;
    return obj;
};

// purchaseOrderSchema.pre("save", function (next) {
//   this._id = mongoose.Types.ObjectId().toString();
//   next();
// });

module.exports = mongoose.model("purchaseOrders", purchaseOrderSchema, "purchaseOrders");
