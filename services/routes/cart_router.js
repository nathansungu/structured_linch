const express = require('express');
const router = express.Router();
const {isauthenticated} = require('../middlewares/authmiddleware');

const {add_to_cart, view_cart, cart_remove, cart_update} = require('../controllers/cartcontroller');

//cart routes
router.post('/addtocart', add_to_cart, isauthenticated);
router.get('/viewcart', view_cart, isauthenticated);
router.delete('/removecart', cart_remove, isauthenticated);
router.put('/updatecart', cart_update, isauthenticated);

module.exports = router;