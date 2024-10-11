
const express = require('express');
const { register, login ,refreshAccessToken,logout} = require('../controllers/auth.controller');
const { protect } = require('../../../infrastructure/middlewares/auth.middleware');

const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refreshAccessToken);
router.post('/logout',protect, logout);

module.exports = router;
