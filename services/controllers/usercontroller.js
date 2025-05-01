const {Customer} = require('../models').Customer;

const editprofile = async (req, res) => {
    const { first_name, second_name, image, email, phone_no } = req.body;
    const userId = req.user.id; 

    try {
        const user = await Customer.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        user.first_name = first_name || user.first_name;
        user.second_name = second_name || user.second_name;
        user.email = email || user.email;
        user.phone_no = phone_no || user.phone_no;
        userId.image = image || user.image; 

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};