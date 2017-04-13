"use strict"

//========================== Load Modules Start =======================
const pointRoutr = require("express").Router();

//========================== Load internal modules ====================


//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================


pointRoutr.route("/")
    .get(function (req, res) {
        res.send('done');
    });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = pointRoutr;

//========================== Export Module End ===============================
