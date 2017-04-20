/**
 */
/**
 */
"use strict";

/**
 * Order Items
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
 * Order Items Schema
 */
var orderItemSchema = new Schema(
    {
        userID: {
            type: Schema.ObjectId,
            required: true
        },
        isPurchaser: {
          type: Boolean,
        },
        orderID: {
          type: Schema.ObjectId
        },
        brandName: {
          type: String,
          required: true
        },
        variantName:{
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        avgBuyPrice:{
          type: Number,
          default: 0
        },
        profit:{
            type: Number,
            default: 0
        },
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

orderItemSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.createdBy;
    return obj;
};

// orderItemSchema.pre("save", function (next) {
//   this._id = mongoose.Types.ObjectId().toString();
//   next();
// });

module.exports = mongoose.model("orderItems", orderItemSchema, "orderItems");
