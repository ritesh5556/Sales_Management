const Transaction = require('../models/transaction'); 

const monthMapping = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
};

exports.getMonthlyStatistics = async (req, res) => {
    try {
       
        const { month } = req.body;
        console.log("month is ", month);

        if (!month || !monthMapping[month]) {
            return res.status(400).json({ error: 'Please provide a valid month name (e.g., "Jan", "Feb", etc.)' });
        }   

        
        const selectedMonth = monthMapping[month];

       
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] }
        });

       
        const totalSaleAmount = transactions
            .filter(transaction => transaction.sold)
            .reduce((sum, transaction) => sum + transaction.price, 0);

        const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
        const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

      
        res.json({
            month,
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error fetching monthly statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
