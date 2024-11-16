const Transaction = require('../models/transaction');
const { getMonthlyStatistics } = require('./statistics');
const { getbarPriceRangeStatistics } = require('./chart');
const { getPieCategoryStatistics } = require('./chart');

exports.getCombinedStatistics = async (req, res) => {
    try {
        
        const { month } = req.body;
        console.log("month", month)
        if (!month) {
            return res.status(400).json({ error: 'Please provide the month' });
        }
        console.log("here we are")
       
        const [monthlyStatistics, priceRangeStatistics, categoryStatistics] = await Promise.all([
            getMonthlyStatistics(req, res), 
            getbarPriceRangeStatistics(req, res), 
            getPieCategoryStatistics(req, res)    
        ]);
        console.log("after fetchig", monthlyStatistics, "bar", priceRangeStatistics, "pie", categoryStatistics)
        
        const combinedResponse = {
            month,
            monthlyStatistics: monthlyStatistics.data,
            priceRangeStatistics: priceRangeStatistics.data,
            categoryStatistics: categoryStatistics.data
        };

        
        res.json(combinedResponse);
    } catch (error) {
        console.error('Error fetching combined statistics:', error);
        res.status(500).json({ error: 'Failed to fetch combined statistics' });
    }
};
