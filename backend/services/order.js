import Customerror from "../errors/customerror";
import { Company, Customer, Order_items, Orders, Products } from "../models";

//create order
const addorder = async (data) => {
  const { customer_id } = data;
  if (!customer_id) {
    Next(new Customerror(400, "Provide userid"));
  }

  const order = await Orders.findOne({
    where: {
      customer_id: customer_id,
      status: "pending",
    },
    include: [
      {
        model: Order_items,
        include: [
          {
            model: Products,
            attribute: ["id", "name", "price", "stock"],
            include: [
              {
                model: Company,
                attributes: ["id", "name"],
              }.model,
            ],
          },
        ],
      },
    ],
  });
  if (!order) {
    Next(new Customerror(400, "No items in your cart. Add to cart to order"));
  }
  //make order
  order.status = "completed";
  await order.save();
  //reduce stock
  for (const item of order.Order_items) {
    const stock = await Products.findByPk(item.product_id);
    if (stock) {
      stock.stock -= item.quantity;
      await stock.save();
    }
  }

  res.status(200).json({ message: "Order placed successfully", order: order });
};
//cancel order
const deleteoder = async (data) => {
  const { order_id } = data;

  const order = await Orders.findOne({
    where: {
      id: order_id,
    },
  });
  if (!order) {
    Next(new Customerror(400, "Invalid Order"));
  }
  order.status = "cancelled";
  await order.save();
  return res.status(200).json({ message: " Order cancelled", order: order });
};
//check delivery status
const checkdeliverystatus = async (data) => {
  const { order_id } = data;
  const order = await Orders.findOne({
    where: { id: order_id },
  });
  res.status(200).json({
    message: "Order status retrieved successfully",
    deliverystatus: order.delivery_status,
  });
};
//update order
