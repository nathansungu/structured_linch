// orders model
const Orders = sequelize.define("Orders", {
    id: {type: DataTypes.INTEGER.UNSIGNED, allowNull:false, primaryKey:true, autoIncrement:true },
    customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total_amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: true },
    delivery_status:{type :DataTypes.STRING, allowNull:false}
});