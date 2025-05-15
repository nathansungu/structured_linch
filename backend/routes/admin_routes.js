//admin 
const express = require('express');
const router = express.Router();
const {addproduct, deleteproduct, updateproduct} = require('../controllers/productcontroller');
const {isAuthenticated} = require('../middlewares/authmiddleware');
const {isAdmin} = require('../middlewares/authmiddleware');
const {cancel_order, order, delivery_status,updateorderstatus} = require('../controllers/ordercontroller');
const {addcategory, updatecategory, deletecategory,getcategory } =require('../controllers/categorycontroller');
const {addcompany, deletecompany, updatecompany, getcompany} = require('../controllers/companycontroller');
//product
//add product
router.post('/addproduct', addproduct, isAuthenticated, isAdmin);
//delete product
router.delete('/deleteproduct', deleteproduct, isAuthenticated, isAdmin);
//update product
router.put('/updateproduct', updateproduct, isAuthenticated, isAdmin);

//order
//cancel order
router.post('/cancelorder', cancel_order, isAuthenticated);
//view all orders
router.get('/orders', order, isAuthenticated);
//delivery status
router.put('/deliverystatus', delivery_status, isAuthenticated, isAdmin);
//update order status
router.put('/updatestatus', updateorderstatus, isAuthenticated, isAdmin);

//category
// add category
router.post('/addcategory', addcategory, isAuthenticated, isAdmin);
//update category
router.put('/updatecategory', updatecategory, isAuthenticated, isAdmin);
//delete category
router.delete('/deletecategory', deletecategory, isAuthenticated, isAdmin);
// get all categories
router.get('/getcategory', getcategory, isAuthenticated, isAdmin);

//company
//add company
router.post('/addcompany', addcompany, isAuthenticated, isAdmin);
//delete company
router.delete('/deletecompany', deletecompany, isAuthenticated, isAdmin);
//update company
router.put('/updatecompany', updatecompany, isAuthenticated, isAdmin);
//get all companies
router.get('/getcompany', getcompany, isAuthenticated, isAdmin);
//get all companies
router.get('/getcompany', getcompany, isAuthenticated, isAdmin);
module.exports = router;