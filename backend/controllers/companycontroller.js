const{Company} = require('../models');
const addcompany = async (req, res) => {
    const { name , location , phone_no, email } = req.body;

    try {
        if (!name ) {
            return res.status(400).json({ message: 'Name is required' });
                      
        }
         //check if the author already exists
         const company = await Company.findOne({ where: { name } });
            if (company) {
                return res.status(400).json({ message: 'Company already exists' });
                
            };
            const newcompany= await Company.create({  name , location , phone_no, email  });
                res.status(201).json({ message: 'company added successfully', Company: newcompany })
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const deletecompany = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const company = await Company.findOne({ where: { name } });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        await Company.destroy({ where: { name } });
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const updatecompany = async (req, res) => {
    const { name, location, phone_no, email } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const company = await Company.findOne({ where: { name } });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        company.location = location || company.location;
        company.phone_no = phone_no || company.phone_no;
        company.email = email || company.email;
        await company.save();
        res.status(200).json({ message: 'Company updated successfully', company });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}
const getcompany = async (req, res)=>{
    try {
        const company = await Company.findAll();
        if (!company) return res.status(404).json({ message: 'No company found' });

        res.status(200).json({ company });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
}

module.exports = {
    addcompany,
    deletecompany,
    updatecompany,
    getcompany
}