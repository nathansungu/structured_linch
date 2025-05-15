//importing the product model
import { Nextfunction, Request, Response } from "express";
const { default: Customerror } = require("../errors/customerror");
const { default: asynchhelper } = require("../helper/asynchhelper");
const { Products, Company, Category } = require("../models");

const addproduct = asynchhelper(async (req, res) => {
  const { name, image, company_id, category_id, price, stock, description } =
    req.body;
  if (
    !name ||
    !image ||
    !company_id ||
    !category_id ||
    !price ||
    !stock ||
    !description
  ) {
    next(new Customerror(400, "provide all the details"));
  }
  const checksimilarproduct = await Products.findOne({ where: { name } });
  if (checksimilarproduct) {
    next(new Customerror(400, "Product already exist"));
  } else {
    const newProduct = await Products.create({
      name,
      company_id,
      category_id,
      price,
      stock,
      description,
    });
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  }
});
const updateproduct = asynchhelper(async (req, res) => {
  const { name, company_id, category_id, price, stock } = req.body;

  const searchProduct = await Products.findOne({ where: { name } });

  if (!searchProduct) {
    next(new Customerror(400, "Invalid product"));
  }
  searchProduct.name = name;
  searchProduct.company_id = company_id;
  searchProduct.category_id = category_id;
  searchProduct.price = price;
  searchProduct.stock = stock;

  await searchProduct.save();
  return res.status(200).send("product updated successfully");
});

const deleteproduct = asynchhelper(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Enter the product name" });
  }
  const getproduct = await Products.findOne({ where: { name } });
  if (!getproduct) {
    return res.status(400).send("Invalid product");
  }
  await Products.destroy({ where: { name } });
  return res.status(200).json({ message: "product deleted" });
});
const viewallproduct = asynchhelper(async (req, res) => {
  const products = await Products.findAll({
    attributes: ["name", "image", "price", "stock", "description"],
    include: [
      {
        model: Company,
        attributes: ["name"],
      },
      {
        model: Category,
        attributes: ["name"],
      },
    ],
  });
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  return res.status(201).json({ message: products });
});

const getproduct = asynchhelper(async (req, res) => {
  const { name } = req.body;

  const searchProduct = await Products.findAll({
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
        required: false,
      },
      {
        model: Category,
        attributes: ["name"],
        where: {
          name: { [Op.like]: `%${name}%` },
        },
        required: false,
      },
    ],
  });

  if (!searchProduct || searchProduct.length === 0) {
    next (new Customerror(404, "No matching products found"))
    
  }

  return res
    .status(200)
    .json({ message: "Matching products found", products: searchProduct });
});

module.exports = {
  addproduct,
  updateproduct,
  deleteproduct,
  viewallproduct,
  getproduct,
};
