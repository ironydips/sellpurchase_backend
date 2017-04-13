"use strict"

//========================== Load Modules Start =======================
const ruleRoutr = require("express").Router();

//========================== Load internal modules ====================


//========================== Load Modules End ==============================================

//========================== Define Routes Start ==============================================


ruleRoutr.route("/")
    .get(function (req, res) {
        res.send('done');
    });

//========================== Define Routes End ==============================================


//========================== Export Module Start ==============================

module.exports = ruleRoutr;

//========================== Export Module End ===============================
