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

exports.getbarPriceRangeStatistics = async (req, res) => {
    try {
        
        const { month } = req.body;
        console.log("m", month);

        if (!month || !monthMapping[month]) {
            return res.status(400).json({ error: 'Please provide a valid month name (e.g., "Jan", "Feb", etc.)' });
        }

        
        const selectedMonth = monthMapping[month];

        
        const priceRanges = await Transaction.aggregate([
            {
                
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] }
                }
            },
            {
                
                $addFields: {
                    priceRange: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$price", 100] }, then: "0-100" },
                                { case: { $and: [{ $gt: ["$price", 100] }, { $lte: ["$price", 200] }] }, then: "101-200" },
                                { case: { $and: [{ $gt: ["$price", 200] }, { $lte: ["$price", 300] }] }, then: "201-300" },
                                { case: { $and: [{ $gt: ["$price", 300] }, { $lte: ["$price", 400] }] }, then: "301-400" },
                                { case: { $and: [{ $gt: ["$price", 400] }, { $lte: ["$price", 500] }] }, then: "401-500" },
                                { case: { $and: [{ $gt: ["$price", 500] }, { $lte: ["$price", 600] }] }, then: "501-600" },
                                { case: { $and: [{ $gt: ["$price", 600] }, { $lte: ["$price", 700] }] }, then: "601-700" },
                                { case: { $and: [{ $gt: ["$price", 700] }, { $lte: ["$price", 800] }] }, then: "701-800" },
                                { case: { $and: [{ $gt: ["$price", 800] }, { $lte: ["$price", 900] }] }, then: "801-900" }
                            ],
                            default: "901-above" 
                        }
                    }
                }
            },
            {
                
                $group: {
                    _id: "$priceRange",
                    itemCount: { $sum: 1 }
                }
            },
            {
                
                $sort: { _id: 1 }
            }
        ]);

      
        const formattedResponse = priceRanges.map(range => ({
            priceRange: range._id,
            itemCount: range.itemCount
        }));

        res.json({
            month,
            statistics: formattedResponse
        });
    } catch (error) {
        console.error('Error fetching price range statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};



exports.getPieCategoryStatistics = async (req, res) => {
    try {
        
        const { month } = req.body;

        if (!month || !monthMapping[month]) {
            return res.status(400).json({ error: 'Please provide a valid month name (e.g., "Jan", "Feb", etc.)' });
        }

        
        const selectedMonth = monthMapping[month];

       
        const categoryStatistics = await Transaction.aggregate([
            {
                
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, selectedMonth] }
                }
            },
            {
                
                $group: {
                    _id: "$category",
                    itemCount: { $sum: 1 }
                }
            },
            {
                
                $sort: { itemCount: -1 }
            }
        ]);

       
        const formattedResponse = categoryStatistics.map(category => ({
            category: category._id,
            itemCount: category.itemCount
        }));

        res.json({
            month,
            statistics: formattedResponse
        });
    } catch (error) {
        console.error('Error fetching category statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
