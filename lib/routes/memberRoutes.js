"use strict"

//========================== Load Modules Start =======================
const memberRoutr = require("express").Router();

//========================== Load internal modules ====================


//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================


memberRoutr.route("/")
    .get(function (req, res) {
      res.send('done');
    });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = memberRoutr;

//========================== Export Module End ===============================
