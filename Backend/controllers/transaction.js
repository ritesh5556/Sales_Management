
const axios = require('axios');
const Transaction = require('../models/transaction');

exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

     
        await Transaction.deleteMany(); 
        await Transaction.insertMany(transactions);
        res.status(201).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Failed to initialize database.' });
    }
};




exports.listTransactions = async (req, res) => {
    try {
        const { page = 1, perPage = 10, search = '', month = 3 } = req.body; 
        console.log("Request Params -> Page:", page, "PerPage:", perPage, "Search:", search, "Month:", month);

        
        let query = { $expr: { $eq: [{ $month: "$dateOfSale" }, month] } };
        console.log("Initial Query (Month Filter):", JSON.stringify(query));

       
        if (search) {
            const searchNum = parseFloat(search);
            query = {
                $and: [
                    query,
                    {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            ...(isNaN(searchNum)
                                ? []
                                : [
                                    {
                                        price: {
                                            $gte: searchNum,
                                            $lt: searchNum + 1
                                        }
                                    }
                                ])
                        ]
                    }
                ]
            };
        }
        console.log("Final Query (With Search):", JSON.stringify(query));

       
        const skip = (page - 1) * perPage;

        let transactions = await Transaction.find(query)
            .skip(skip)
            .limit(Number(perPage));
        console.log("Transactions Found:", transactions.length);


        if (transactions.length < perPage && search) {
            const additionalTransactions = await Transaction.find({
                $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
                _id: { $nin: transactions.map((t) => t._id) }
            })
                .skip(skip)
                .limit(perPage - transactions.length);
            transactions = [...transactions, ...additionalTransactions];
        }

   
        const total = await Transaction.countDocuments(query);

        res.json({
            page: Number(page),
            perPage: Number(perPage),
            totalPages: Math.ceil(total / perPage),
            totalRecords: total,
            transactions,
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};



