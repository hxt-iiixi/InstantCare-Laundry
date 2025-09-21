const express = require('express');
const { getUser } = require('../controllers/authController');
const auth = require('../middleware/auth'); // Assuming you have JWT authentication middleware

const router = express.Router();

// Protected route to get user data
router.get('/user', auth, getUser); // auth middleware ensures token validation

module.exports = router;
