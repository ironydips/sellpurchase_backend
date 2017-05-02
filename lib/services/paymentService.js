"use strict";

//========================== Load Modules Start =======================


//========================== Load internal modules ====================

// Load payment dao
const paymentDao = require("../dao/paymentDao");
const purchaserDao = require("../dao/purchaseDao");
const _ = require("lodash");


//========================== Load Modules End ==============================================

function updateBalance(amount, user, isPurchaser) {
    if(isPurchaser){
        purchaserDao.updateBalance(amount, user);
    }
    else{
        //seller
    }
}

//========================== Export Module Start ==============================

module.exports = {
    updateBalance
};

//========================== Export Module End ===============================
