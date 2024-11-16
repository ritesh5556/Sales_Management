
const express = require('express');
const {getMonthlyStatistics} = require("../controllers/statistics")

const router = express.Router();


router.post("/", getMonthlyStatistics);


module.exports = router;
