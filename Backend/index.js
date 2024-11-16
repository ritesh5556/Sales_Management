
const express = require("express");
const app = express();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const initializeDatabase = require("./routes/transaction");
const statistics = require("./routes/statistics");
const chart = require("./routes/chart");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();


database.connect();
 
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);



app.use("/api/transaction", initializeDatabase);
app.use("/api/statistics", statistics);
app.use("/api/chart", chart);


app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

