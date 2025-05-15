const { Orders, Order_items, Products, Company } = require('../models');

//view all orders
const order = async(req, res)=>{
    const {customer_id} = req.body;
  
    try {
      // Find the pending order for the user
    const order = await Orders.findOne({
      where: {
        customer_id: customer_id,
        status: 'pending'
      },
      include: [
        {
        model: Order_items,
        include: [
          {
            model: Products,
            attributes: ['id', 'name', 'price', 'stock'],
            include: [
            {
              model: Company,
              attributes: ['id', 'name'],
            },
            ],
          },
        ],
        },
      ],
    });
  
      if (!order) return res.status(404).send('No items in your cart. Add to cart to order');
  
      // Change order status to completed
      order.status = 'completed';
      await order.save();
  
      // reduce product stock quantities
      for (const item of order.Order_items) {
        const stock = await Products.findByPk(item.product_id);
        if (stock) {
          stock.stock -= item.quantity;
          await stock.save();
        }
      }
  
      res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    }

}
const cancel_order = async(req, res) =>{
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
const delivery_status = async(req, res) =>{
    const {orderid , customer_id } = req.body;

    try {
        const order = await Orders.findOne({ where: { id: orderid, customer_id: customer_id } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json({ 
            message: 'Order status retrieved successfully', 
            deliverystatus: order.delivery_status 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
//update order status
const updateorderstatus = async(req, res) =>{
    const { orderid, status } = req.body;
    if (!orderid || !status) {
        return res.status(400).json({ message: 'Order ID and status are required' });
    }

    try {
        const order = await Orders.findByPk(orderid);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.delivery_status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}

module.exports = { order, cancel_order, delivery_status, updateorderstatus };