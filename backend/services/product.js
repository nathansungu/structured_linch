import { Products, Category, Company } from "../models";
import { Customerror } from "../errors/customerror";

const addproduct = async (data) => {
  const { image, name, description, stock } = data;
  if (!image || !name || !description || !stock) {
    Next(new Customerror(400, "Provide all the details"));
  }
  //check if product exist
  const existing = await Products.findOne({ where: { name: name } });
  if (existing) {
    Next(new Customerror(400, "Product name is taken"));
  }
  const newproduct = await Products.create({
    image,
    name,
    description,
    stock,
  });
  if (!newproduct) {
    Next(new Customerror(400, "Error creating product."));
  } else {
    return {
      messeage: "Product added.",
      Products: newproduct,
    };
  }
};
const updateproduct = async (data) => {
  const { name, image, description, stock } = data;

  if (!name) {
    Next(new Customerror(400, "Provide product name"));
  }
  const updateproduct = await Products.update({
    data: { name, image, description, stock },
    where: {
      name: name,
    },
  });
  return {
    message: "Product updated.",
    updatedproduct: updateproduct,
  };
};
const deleteproduct = async (data) => {
  const { name } = data;

  const checkproduct = await Products.findOne({
    where: { name: name },
  });
  if (!checkproduct) {
    Next(new Customerror(400, "Invalid product"));
  }

  const deleteproduct = await Products.destroy({
    where: { name: name },
  });
  return {
    message: "Product deleted",
  };
};

const getallproduct = async (data) => {
  const products = await Products.findAll({
    attributes: ["name", "image", "price", "stock", "description"],
    include: [
      { model: Company, attributes: ["name"] },
      { model: Category, attributes: ["name"] },
    ],
  });

  if (!products || products.length === 0) {
    throw new Customerror(404, "No products found");
  }

  return { message: products };
};

//search for a product
const searchProduct = async (data) => {
  const { name } = data;
  const product = await Products.findAll({
    attributes: [name],
    where: {
      name: { [Op.like]: `%${name}%` },
    },
    include: [
      {
        model: Company,
        attributes: ["name"],
        where: {
          name: { [Op.like]: `%${name}%` },
        },
        require: false,
      },
      {
        model: Category,
        attributes: ["name"],
        where: {
          name: { [Op.like]: `%${name}%` },
        },
      },
    ],
  });
};

module.exports ={
    getallproduct,
    searchProduct,
    addproduct,
    deleteproduct,
    updateproduct
}
