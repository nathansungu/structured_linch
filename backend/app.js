const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/dbconnect");
const cors = require("./config/cors");
const session =require('./config/session');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors);
app.use(session);
// Connect to DB
connectDB();

// Import routes
const authRouter = require("./routes/auth_router");
const companyRouter = require("./routes/company_router");
const productRouter = require("./routes/product_router");
const orderRouter = require("./routes/order_router");
const categoryRouter = require("./routes/category_router");
const adminRouter = require("./routes/admin_routes");
const userRouter = require("./routes/user_router");
const errorHandler = require("./middlewares/errormiddleware");

app.use("/auth", authRouter);
app.use("/company", companyRouter);
app.use("product", productRouter);
app.use("/order", orderRouter);
app.use("/category", categoryRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use(errorHandler);

// Start server after connection
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});