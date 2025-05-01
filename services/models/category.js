//category
const Category = sequelize.define("Category",{
    name: {type: DataTypes.STRING(20), allowNull:false,
    description: {type: DataTypes.STRING(255), allowNull:true}
    }
})