const {Customer, Orders, Order_items, Products, Admin} = require('../models');
//import authmiddleware
const { isAuthenticated } = require('../middlewares/authMiddleware');

const registerdmin = async (req, res) => {
    try {
        const { first_name, second_name, email, phone_no, password, confirmPassword } = req.body;
        if (!first_name || !second_name || !email || !phone_no || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password don't match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            first_name: Sequelize.literal(`'${first_name.replace(/'/g, "''")}'`),
            second_name: Sequelize.literal(`'${second_name.replace(/'/g, "''")}'`),
            email: Sequelize.literal(`'${email.replace(/'/g, "''")}'`),
            phone_no: Sequelize.literal(`'${phone_no.replace(/'/g, "''")}'`),
            password: hashedPassword
        });

        res.status(201).json({
            message: "Admin registered successfully",
            admin: { id: newAdmin.id, name: newAdmin.first_name, email: newAdmin.email },
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            let field = error.errors[0]?.path;
            if (field == "phone_no") {
                field = " phone Number "
            };
            res.status(400).json({ message: `A record with this ${field} already exists` });
        } else {
            res.status(400).json({ message: "An error occurred" });
        }
    }
}
const get_all_admin = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        if (!admins) {
            return res.status(404).json({ message: 'No admins found' });
        }
        res.status(200).json({ message: 'Admins retrieved successfully', admins });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const update_delivery_status = async (req, res) => {
    const { orderid, customer_id, delivery_status } = req.body;
    if (!orderid || !customer_id || !delivery_status) {
        return res.status(400).json({ message: 'Order ID, customer ID and delivery status are required' });
    }

    try {
        const order = await Orders.findOne({ where: { id: orderid, customer_id: customer_id } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.delivery_status = delivery_status;
        await order.save();

        res.status(200).json({ message: 'Delivery status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const get_all_orders = async (req, res) => {
    try {
        const orders = await Orders.findAll({
            include: [
                {
                    model: Order_items,
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name'],
                        },
                    ],
                },
                {
                    model: Customer,
                    attributes: ['id', 'first_name', 'second_name'],
                },
            ],
        });
        if (!orders) return res.status(404).json({ message: 'No orders found' });

        res.status(200).json({ message: 'Orders retrieved successfully', orders });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const get_order_by_id = async (req, res) => {
    const { orderid } = req.body;
    if (!orderid) {
        return res.status(400).json({ message: 'Order ID is required' });
    }

    try {
        const order = await Orders.findOne({
            where: { id: orderid },
            include: [
                {
                    model: Order_items,
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name'],
                        },
                    ],
                },
                {
                    model: Customer,
                    attributes: ['id', 'first_name', 'second_name'],
                },
            ],
        });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ message: 'Order retrieved successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const cancel_order = async (req, res) => {
    const { orderid, customer_id } = req.body;
    if (!orderid || !customer_id) {
        return res.status(400).json({ message: 'Order ID and customer ID are required' });
    }

    try {
        const order = await Orders.findOne({ where: { id: orderid, customer_id: customer_id } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const get_all_customers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        if (!customers) {
            return res.status(404).json({ message: 'No customers found' });
        }
        res.status(200).json({ message: 'Customers retrieved successfully', customers });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const get_customer_by_id = async (req, res) => {
    const { customer_id } = req.body;
    if (!customer_id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json({ message: 'Customer retrieved successfully', customer });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
//restricted to admin
const delete_customer = async (req, res) => {
    //check if the user is an admin logged in

    const { customer_id } = req.body;
    if (!customer_id) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        const customer = await Customer.findOne({ where: { id: customer_id } });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await Customer.destroy({ where: { id: customer_id } });

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}




