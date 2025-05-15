const express = require('express');
const router = express.Router();
const {editprofile} = require('../controllers/usercontroller');
const { isAuthenticated } = require('../middlewares/authmiddleware');
const usercontroller = require('../controllers/authcontroller')
// Public routes
router.put('/editprofile',isAuthenticated, editprofile);

// Protected route
router.get('/profile', isAuthenticated, usercontroller.profile_details);

// Login page
router.get('/profile/page', usercontroller.customer_login_page);

module.exports = router;
