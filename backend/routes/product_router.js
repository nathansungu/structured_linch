const express = require('express');
const router  = express.Router();
const {getproduct, viewallproduct} = require('../controllers/productcontroller');
//product
router.get('/search',getproduct);
router.get('/products',viewallproduct);

module.exports =router;
