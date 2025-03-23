const express = require('express');
const router = express.Router();

// Import your controllers
// Does this belong here? Should it be in the controller?
const { registerUser, loginUser } = require('../controllers/userController');

