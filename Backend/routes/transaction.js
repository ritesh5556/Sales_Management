
const express = require('express');
const { initializeDatabase, listTransactions } = require('../controllers/transaction');
const { getCombinedStatistics } = require('../controllers/combinedStatistics');

const router = express.Router();

router.get('/initialize', initializeDatabase);

router.post('/', listTransactions);


module.exports = router;
