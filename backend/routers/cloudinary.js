const express = require('express');
const { generateSignature } = require('../controllers/cloudinary');
const router = express.Router();

// Define the route and use the controller function
router.get('/', generateSignature);

module.exports = router;