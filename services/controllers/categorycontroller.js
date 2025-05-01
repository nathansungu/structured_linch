const{Category} = require('../models');
const addcategory = async (req, res) => {
    const { name, description} = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        //check if the author already exists
        const category = await Category.findOne({ where: { name } });
        if (category) {
            return res.status(400).json({ message: 'Category already exists' });
        };
        const newcategory = await Category.create({ name, description });
        res.status(201).json({ message: 'Category added successfully', Category: newcategory })
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const updatecategory = async (req, res) => {
    const { name, newName, description } = req.body;
    try {
        if (!name || !newName) {
            return res.status(400).json({ message: 'Name and new name are required' });
        }
        const category = await Category.findOne({ where: { name } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.name = newName;
        category.description = description;
        await category.save();
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const deletecategory = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const category = await Category.findOne({ where: { name } });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await Category.destroy({ where: { name } });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const getcategory = async (req, res) => {
    try {
        const categories = await Category.findAll();
        if (!categories) {
            return res.status(404).json({ message: 'No categories found' });
        }
        res.status(200).json({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
module.exports = {
    addcategory,
    updatecategory,
    deletecategory,
    getcategory
};