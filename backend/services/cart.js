//cart services

const { default: Customerror } = require("../errors/customerror");
const {
  Order_items,
  Products,
  Company,
  Orders,
  Customer,
} = require("../models");

//add to cart
const add_to_cart = async (data) => {
  //check if product id exists
  const product = await Products.findByPk(product_id);
  if (!product) {
    return res.status(400).json({ message: "Invalid product" });
  }
  //find or create a pending order for the user
  let order = await Orders.findOne({
    where: { customer_id: customer_id, status: "pending" },
  });
  if (order) {
    //check items table for the same item update the quantity
    let sameproduct = await Order_items.findOne({
      where: { product_id: product_id, id: order.id },
    });
    if (sameproduct) {
      sameproduct.quantity += quantity;
      await sameproduct.save();
    } else {
      // create a new order item if the product is not in the cart
      await Order_items.create({
        OrderId: order.id,
        product_id,
        quantity,
        price: product.price,
      });
    }
  } else {
    //create a new pending order if none exist
    //
    order = await Orders.create({
      customer_id: customer_id,
      total_amount: 0,
      status: "pending",
      delivery_status: "pending",
    });
    await Order_items.create({
      OrderId: order.id,
      product_id,
      quantity,
      price: product.price,
    });
  }

  // Recalculate the total amount by multiplying the quantity with the price
  const itemsquantity = await Order_items.findOne({
    where: { order_id: order.id },
  });

  const total_amount = itemsquantity.quantity * product.price;
  order.total_amount = total_amount;
  await order.save();

  res.status(200).json({ message: "Product added to cart", order });
};

//view cart

const view_cart = async (data) => {
  const { customer_id } = data;
  if (!customer_id) {
    Next(new Customerror(400, "Invalid user"));
  }
  const order = await Orders.findAll({
    where: { customer_id, status: "pending" },
    attributes: ["id", "total_amount", "status"],
    include: [
      {
        model: Order_items,
        attributes: ["id", "order_id", "price", "quantity"],
        include: [
          {
            model: Products,
            attributes: ["id", "name"],
            include: [
              {
                model: Company,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!order) return res.status(404).json({ message: "No items in the cart" });

  res.status(200).json({
    message: "cart items retrived correctly",
    order_items: order,
  });
};

//remove form cart
const cart_remove = async (data) => {
  const { customer_id, product_id } = req.body;

  if (!customer_id || !product_id) {
    return res
      .status(400).json({ message: "Valid customer ID and product ID are required" });
  }

  // Find the pending order for the customer
  const order = await Orders.findOne({
    where: { customer_id, status: "pending" },
  });
  if (!order) {
    return res.status(404).json({ message: "No items in cart found" });
  }

  // Find the order item to be removed
  const orderItem = await Order_items.findOne({
    where: { order_id: order.id, product_id },
  });
  if (!orderItem) {
    return res.status(404).json({ message: "Product not found in the cart" });
  }

  // Remove the order item
  await orderItem.destroy();

  // Recalculate the total amount
  const remainingItems = await Order_items.findAll({
    where: { order_id: order.id },
  });
  const total_amount = remainingItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  order.total_amount = total_amount;
  await order.save();

  res.status(200).json({ message: "Product removed from cart", order });
};

//update cart 
const cart_update =async(data)=>{
    const{customer_id, product_id, quantity } = req.body;
    if (!customer_id || !product_id || !quantity) {
        return res.status(400).json({ message: 'Valid customer ID, product ID, and quantity are required' });
    }
}

exports.module = {
  view_cart,
  add_to_cart,
  cart_remove,

};
