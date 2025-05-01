const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json());

// Connect to DB
connectDB();

// Start server after connection
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
