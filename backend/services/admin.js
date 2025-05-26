//admin services
const sequelize = require("sequelize");
const {Customer, Orders, order_items, products,Admin} = require("../models");
const { default: Customerror } = require("../errors/customerror");


// register admin
const register = async(data)=>{
    const {first_name, second_name, email, phone_no, password, confirmPassword} =data;
    if (!first_name|| !second_name||!email || !phone_no || !password || !confirmPassword) {
        return res.status(400).json({message: "provide all the details"})
        
    }

    //cornfir password
    if (password != confirmPassword) {
        return res.status(400).json({message: "Passwords don't match"})        
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
            first_name: sequelize.literal(`'${first_name.replace(/'/g, "''")}'`),
            second_name: sequelize.literal(`'${second_name.replace(/'/g, "''")}'`),
            email: sequelize.literal(`'${email.replace(/'/g, "''")}'`),
            phone_no: sequelize.literal(`'${phone_no.replace(/'/g, "''")}'`),
            password: hashedPassword
    })
    if (newAdmin) {
        return res.status(400).json({
            message: `Admin ${newAdmin.first_name}, added.` ,
            newAdmin: newAdmin
        })
        
    }
}
// To Do implement already exist admin

//get all admin
 const get_all_admin = async(data)=>{
    const alladmins = Admin.findAll();
    if (Admin) {
        return res.status(200).json({
            message: "Admins retrived succesfully",
            admins: alladmins
        })

        
    }else{
        next (new Customerror(400, "Failled to load admins at the moment"))
    }
 }

 //update admins detail
 const update_admin = async(data)=>{
    const { admin_id, admin_email,first_name,second_name} = data;
    if (!admin_id ) {
        Next (new Customerror(400, "Provide admin id"))
    }
    const update_admin = await Admin.update({
        data:{admin_email,first_name,second_name},
        where:{admin_id}
    })
}
const suspend_user = async(data)=>{
    const {user_id} =data;
    const find_user = await Customer.findOne({
        where:{user_id:user_id}
    })
    if (!find_user) {
        next(new Customerror(400, "Invalid user"))
        
    }else{
        find_user.status="suspended"
        await find_user.save();
    }
//To DO add status row on customers table
}
module.exports={
    register,
    update_admin,
    get_all_admin,
    suspend_user
}