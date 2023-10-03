const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.post('/login', (req, res) => auth.loginUser(req, res));

router.post('/register', (req, res) => auth.registerUser(req, res));

module.exports = router;
