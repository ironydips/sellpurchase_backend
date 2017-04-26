"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load purchaser order dao
const orderItemDao = require("../dao/orderItemDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================

function addOrderItems(orderItems, orderID, isPurchaser, userID, date) {
  let mappedItems = [];

  orderItems.forEach(function (data) {
    let item = {};
    item.userID = userID;
    item.isPurchaser = isPurchaser;
    item.orderID = orderID;
    item.brandName = data.brandName;
    item.variantName = data.variantName;
    item.price = data.price;
    item.quantity = data.quantity || data.qty;
    item.avgBuyPrice = isPurchaser ? 0 : data.avgBuyPrice;
    item.profit = isPurchaser ? 0 : (data.price - data.avgBuyPrice) * data.quantity;
    date ? item.createdOn = date : null;

    mappedItems.push(item);
  });

  return orderItemDao.addOrderItems(mappedItems);
}

//========================== Export Module Start ==============================

module.exports = {
    addOrderItems,
    getOrderItems : orderItemDao.getOrderItems

};

//========================== Export Module End ===============================
