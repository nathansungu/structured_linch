// order items
const Order_items = sequelize.define("Order_items",{
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'order_id' },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
});