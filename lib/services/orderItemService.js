"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load purchaser order dao
const orderItemDao = require("../dao/orderItemDao");
const _ = require("lodash");

//========================== Load Modules End ==============================================

function addOrderItems(orderItems, orderID, otherInfo) {
  let mappedItems = [];

  orderItems.forEach(function (data) {
    let availableQty = data.availableQty ? parseFloat(data.availableQty) : 0;

    let item = {};
    item.userName = otherInfo.userName;
    item.userID = otherInfo.userID;
    item.isPurchaser = otherInfo.isPurchaser;
    item.orderID = orderID;
    item.brandName = data.brandName;
    item.variantName = data.variantName;
    item.price = data.price;
    item.quantity = data.quantity || data.qty;
    item.avgBuyPrice = otherInfo.isPurchaser ? 0 : data.avgBuyPrice;
    item.profit = otherInfo.isPurchaser ? 0 : (parseFloat(data.price) - parseFloat(data.avgBuyPrice)) * parseFloat(data.quantity);
    item.lastStock = availableQty;

    if(otherInfo.isPurchaser){
      item.remainingStock = otherInfo.isReturned ? (availableQty - parseFloat(item.quantity)) 
                                                    : (data.availableQty + parseFloat(item.quantity));

    }

    //TODO: For Sellers else part

    otherInfo.date ? item.createdOn = date : null;

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
