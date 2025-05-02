//authentication controllers
const {Customer, Admin, } = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require("../config/session");
const cors = require("../config/cors");

const register_customer = async (req, res) => {
    try {
        const { first_name, second_name, email,phone_no, password, confirmPassword} = req.body;
        if (!first_name || !second_name || !email || !phone_no|| !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password don't match" });            
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = await Customer.create({
            first_name: Sequelize.literal(`'${first_name.replace(/'/g, "''")}'`),
            second_name: Sequelize.literal(`'${second_name.replace(/'/g, "''")}'`),
            email: Sequelize.literal(`'${email.replace(/'/g, "''")}'`),
            phone_no: Sequelize.literal(`'${phone_no.replace(/'/g, "''")}'`),
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            customer: { id: newCustomer.id, name: newCustomer.first_name, email: newCustomer.email },
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            let field = error.errors[0]?.path;
            if (field == "phone_no") {
                field =" phone Number "       
            };
            res.status(400).json({ message: `A record with this ${field} already exists` });
        } else {
            res.status(400).json({ message:  "An error occurred" });
        }
    }

};
//login 
const login = async (req, res) =>{
    try {
        const { email} = req.body;
        //make passord a string
        const password = String(req.body.password);
        if (!email || !password) {
            return res.status(401).json({ message: "All fields are required " });
        }

        // Check for customer first
        let user = await Customer.findOne({ where: { email } });
        let admin = await Admin.findOne({ where: { email } });
        if (user) {
            const checkpassword = await bcrypt.compare(password, user.password);
            
            // If password matches, set session and return user info
            if (!checkpassword) {
                return res.status(401).json({ message: "Invalid email or password" });
            } else {
                req.session.user = {
                    id: user.id,
                    name: user.first_name,
                    email: user.email , 
                    phone_no: user.phone_no, 
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    role: "customer"     
                };
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ message: "Could not save session." });
                    }
                });
                //console.log("Session data:", req.session.user);
                console.log(req.session);

                return res.status(201).json({
                    message: "Login successful",
                    role: "customer",
                    user: { id: user.id, name: user.first_name, email: user.email, role: "customer" },
                });
            } 
        } else if (admin) {
            // If not customer, check for admin
            const adminpassword = await bcrypt.compare(password, admin.password);
            if (adminpassword) {
                req.session.user = {
                    id: admin.id,
                    name: admin.first_name,
                    email: admin.email,
                    role: "admin",
                };
                // Save session
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ message: "Could not save session." });
                    }
                });
                return res.status(201).json({
                    message: "Login successful",
                    role: "admin",
                    user: { id: admin.id, name: admin.first_name, email: admin.email, role: "admin" },
                });
            } else {
                return res.status(401).json({ message: "Invalid email or password" });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error logging in. Contact customer care." });
    }

}
//profile path
const profile_details = async (req, res) =>{
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized. login" });
    }
    res.status(200).json({
        message: "Hello, " + req.session.user.name,
        user: req.session.user,
    });

}
//loginpage
const customer_login_page = async (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/customer_profile.html'));
}
const admin_login_page = async (req, res) =>{
    res.sendFile(path.join(__dirname, '../frontend/admin_profile.html'));
}
const logout = async (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: "Logged out successfully" });
    res.redirect('/login'); // Redirect to login page after logout
}

module.exports = {register_customer, login, profile_details, customer_login_page, admin_login_page, logout};