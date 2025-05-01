// admin model
const Admin = sequelize.define("Admin_users", {
    first_name: { type: DataTypes.STRING(30), allowNull: false },
    second_name: { type: DataTypes.STRING(30), allowNull: false },
    phone_no: { type: DataTypes.STRING(14), allowNull: false, unique:true },
    email: { type: DataTypes.STRING(50), allowNull: false, unique:true },
    password: { type: DataTypes.STRING(100), allowNull: false }
});

