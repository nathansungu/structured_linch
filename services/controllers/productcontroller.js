//importing the product model
const { Products, Company, Category } = require("../models");
const addproduct = async (req, res) => {
    try {
        const{name, image, company_id, category_id, price, stock,description}=req.body;
        if (!name|| !image|| !company_id || !category_id|| !price|| !stock|| !description) {
            return res.status(400).json({message: "provide all the details"})
        }
        const checksimillarproduct = await Products.findOne({where: {name}});   
        if (checksimillarproduct) {
            return res.status(400).json({message: "Product already exists"})
            
        }else{
            const newProduct = await Products.create({ name, company_id, category_id, price,stock,description});
            res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });
        }
        
    } catch (error) {
        next(error);
    }

}
const updateproduct = async (req, res) => {
    const{name, company_id,category_id, price,stock}=req.body
    try {
        const searchProduct = await Books.findOne({where: {name}});
        if (!searchProduct) {
            return res.status(400).send("Invalid product");
        }
        searchProduct.name = title;
        searchProduct.company_id=company_id;
        searchProduct.category_id=category_id;
        searchProduct.price = price;
        searchProduct.stock =stock;

        await searchProduct.save();
        return res.status(200).send("product updated successfully");
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).send("Cannot update product at the moment");
    }
}
const deleteproduct = async (req, res) => {
    const{ name}=req.body;
    try {
        if (!name) {
            return res.status(400).json({message: "Enter the product name"})        
        }
        const getproduct = await Products.findOne({where: {name}});
        if (!getproduct) {
            return res.status(400).send("Invalid product")        
        }
        await Products.destroy({ where: { name } });
            return res.status(200).json({message: "product deleted"});        
    } catch (error) {
        return res.status(500).json({message: "Error occurred while deleting the product"});
    }
}
const viewallproduct = async (req, res) => {
    try {
        const products = await Products.findAll({
            attributes: ['name','image', 'price', 'stock', 'description'],
            include: [
            {
                model: Company,
                attributes: ['name'],
            },
            {
                model: Category,
                attributes: ['name'],
            }
            ]
        });
        if(!products) {
            return res.status(404).json({message: 'No products found'});
        }
        return res.status(201).json({message: products});
    } catch (error) {
        next(error);
    }
}
const getproduct = async (req, res) => {
    const {name} =req.body;
    try {
        const searchProduct = await Products.findAll({
            where: {
            name: { [Op.like]: `%${name}%` }
            },
            include: [
            {
                model: Company,
                attributes: ['name'],
                where: {
                name: { [Op.like]: `%${name}%` }
                },
                required: false
            },
            {
                model: Category,
                attributes: ['name'],
                where: {
                name: { [Op.like]: `%${name}%` }
                },
                required: false
            }
            ]
        });

        if (!searchProduct || searchProduct.length === 0) {
            return res.status(404).json({ message: "No matching products found" });
        }

        return res.status(200).json({ message: "Matching products found", products: searchProduct });
    } catch (error) {
        
    }
}

module.exports = {
    addproduct,
    updateproduct,
    deleteproduct,
    viewallproduct,
    getproduct
}