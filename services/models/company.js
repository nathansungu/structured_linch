// company model
const Company = sequelize.define("Company", {
    name: { type: DataTypes.STRING(20), allowNull: false },
    location: { type: DataTypes.STRING(20), allowNull: true},
    phone_no: { type: DataTypes.STRING(14), allowNull: true, unique:true },
    email: { type: DataTypes.STRING(50), allowNull: true, unique:true }
});