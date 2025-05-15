// import modules
const express = require("express");
const { Sequelize, DataTypes, HasMany, BelongsTo, or } = require("sequelize");
const dotenv =require("dotenv");
const { charset } = require("mime-types");
const { orderBy } = require("lodash");
const { type } = require("os");
const app = express();  

dotenv.config();
//middleware
app.use(express.json());
dotenv.config({ path: '../.env' });

//database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVERNAME,
    dialect: "mysql",
    dialectOptions: {
        charset: "utf8",
    },
    define: {
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
    },
});

// Set database attributes to unsigned
Object.keys(sequelize.models).forEach(modelName => {
    const attributes = sequelize.models[modelName].rawAttributes;
    Object.keys(attributes).forEach(attributeName => {
      if (attributes[attributeName].type instanceof DataTypes.INTEGER) {
        attributes[attributeName].type = DataTypes.INTEGER.UNSIGNED;
      }
    });
  });
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected!");
      await sequelize.sync({ alter: true });
      console.log("Models synchronized!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  })();

// Error Handling Middleware
app.use((err, res) => {
    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
});

// customer model
const Customer = sequelize.define("Customer", {
    first_name: { type: DataTypes.STRING(30), allowNull: false },
    second_name: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    phone_no: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(100), allowNull: false }
});
// admin model
const Admin = sequelize.define("Admin_users", {
  first_name: { type: DataTypes.STRING(30), allowNull: false },
  second_name: { type: DataTypes.STRING(30), allowNull: false },
  phone_no: { type: DataTypes.STRING(14), allowNull: false, unique:true },
  email: { type: DataTypes.STRING(50), allowNull: false, unique:true },
  password: { type: DataTypes.STRING(100), allowNull: false }
});



// products model
const Products = sequelize.define("Products", {
    name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    image:{type:DataTypes.STRING(255), allowNull:true},
    description: { type: DataTypes.STRING(255), allowNull: false},
    company_id: { type: DataTypes.INTEGER(6), allowNull: false },
    category_id: { type: DataTypes.INTEGER(6), allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
});
// company model
const Company = sequelize.define("Company", {
    name: { type: DataTypes.STRING(20), allowNull: false },
    location: { type: DataTypes.STRING(20), allowNull: true},
    phone_no: { type: DataTypes.STRING(14), allowNull: true, unique:true },
    email: { type: DataTypes.STRING(50), allowNull: true, unique:true }
});
// orders model
const Orders = sequelize.define("Orders", {
    id: {type: DataTypes.INTEGER.UNSIGNED, allowNull:false, primaryKey:true, autoIncrement:true },
    customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total_amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true },
    delivery_status:{type :DataTypes.STRING, allowNull:false}
});
// order items
const Order_items = sequelize.define("Order_items",{
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'order_id' },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
});
//category
const Category = sequelize.define("Category",{
    name: {type: DataTypes.STRING(20), allowNull:false,
    description: {type: DataTypes.STRING(255), allowNull:true}
    }
})

//relationships
Customer.hasMany(Orders, { foreignKey: 'customer_id' });
Orders.belongsTo(Customer, { foreignKey: 'customer_id' });

Products.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Products, { foreignKey: 'company_id' });

Orders.hasMany(Order_items, { foreignkey: 'OrderId' });
Order_items.belongsTo(Orders, { foreignKey: 'OrderId'});

Order_items.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(Order_items, { foreignKey: 'product_id' });

Category.hasMany(Products, { foreignKey: 'category_id' });
Products.belongsTo(Category, { foreignKey: 'category_id' });

// export modules
module.exports = {  
  Customer,
  Admin,
  Products,
  Company,
  Orders,
  Order_items,
  Category
}
  