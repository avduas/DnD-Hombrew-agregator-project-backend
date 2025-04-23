const express = require('express');
const { registration, login } = require('../controllers/registrationController');

const router = express.Router();

router.post('/register', registration);
router.post('/login', login);

module.exports = router;
