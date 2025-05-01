// customer model
const Customer = sequelize.define("Customer", {
    first_name: { type: DataTypes.STRING(30), allowNull: false },
    second_name: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    phone_no: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(100), allowNull: false }
});