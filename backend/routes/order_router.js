const express = require('express');
const router =express.Router();
const {isauthenticated} = require('../middlewares/authmiddleware');
const {order,cancel_order, delivery_status} = require('../controllers/ordercontroller');

//order routes
//private routes
router.post('/order', order, isauthenticated);
router.put('/cancelorder', cancel_order, isauthenticated);
router.get('/deliverystatus', delivery_status, isauthenticated);

module.exports = router;