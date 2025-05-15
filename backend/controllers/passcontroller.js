//importing required modules
const { Customer} = require("../models");
const bcrypt = require("bcrypt");

//password reset
const pass_reset = async (req, res)=> {
    const { email } = req.body;
    try {
        const user = await Customer.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(token, 10);
        await user.update({ reset_token: hashedToken, reset_token_expiry: Date.now() + 3600000 }); // 1 hour 
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        // Send email with reset link (using nodemailer or any other email service)
        console.log(`Password reset link: ${resetLink}`);
        return res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending password reset link" });
    }
}
//change password
const changepass = async(req, res) => {
    const {email, oldpass, newpass} = req.body;
    try{
        const user = await Customer.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const checkpassword = await bcrypt.compare(oldpass, user.password);
        if (!checkpassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const hashedPassword = await bcrypt.hash(newpass, 10);
        await user.update({ password: hashedPassword });
        return res.status(200).json({ message: "Password changed successfully" });
    }catch{
        return res.status(400).json({ message: "Error changing password" });
    }
}
module.exports = {
    pass_reset, changepass
}