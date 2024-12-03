const express = require('express');
const auth = require('../services/auth');
const rest = require('../services/restaurants');
const router = express.Router();
const jwt = require('../utils/jwt')

router.post('/user-signin', auth.userLogin);
router.post('/user-create', auth.userCreate);
router.get('/search', rest.searchRestaurant);
router.get('/menu', rest.menuRestaurant);
router.post('/cart', jwt.authenticationToken, rest.addToCart);
router.get('/get-cart', jwt.authenticationToken, rest.getCartDetails);


module.exports = router;