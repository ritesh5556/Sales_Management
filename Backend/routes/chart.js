
const express = require('express');
const {getbarPriceRangeStatistics, getPieCategoryStatistics} = require("../controllers/chart")

const router = express.Router();


router.post("/bar", getbarPriceRangeStatistics);
router.post("/pie", getPieCategoryStatistics);

module.exports = router;
