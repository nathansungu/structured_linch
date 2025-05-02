//handle registration and login
const express = require('express');
const router = express.Router();
const {register_customer, login, logout} = require('../controllers/authcontroller');
const {pass_reset, changepass, } = require('../controllers/passcontroller');
const {isauthenticated} = require('../middlewares/authmiddleware');

router.post('/register', register_customer);
router.post('/login', login);
//logout
router.get('/logout',isauthenticated, logout);


//forgot password reset
router.post('/forgot-password', pass_reset);

//change password
router.post('/change-password', isauthenticated,changepass);

module.exports = router;