const { default: Customerror } = require('../errors/customerror');
const { default: asynchhelper } = require('../helper/asynchhelper');

const {Customer} = require('../models').Customer;

const editprofile = async (req, res) => {
    const { first_name, second_name, image, email, phone_no } = req.body;
    const userId = req.user.id; 

    
        const user = await Customer.findByPk(userId);
        if (!user) {
            next( new Customerror(400,"User not found"))
        }

        // Update user details
        user.first_name = first_name || user.first_name;
        user.second_name = second_name || user.second_name;
        user.email = email || user.email;
        user.phone_no = phone_no || user.phone_no;
        userId.image = image || user.image; 

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
 
};
editprofile = asynchhelper(editprofile)
module.exports = {
    editprofile,
};