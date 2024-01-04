var express = require('express');
const {
   addToCart,
   removeFromCart,
   getCartItems,
} = require('../services/cart.service');
var router = express.Router();

router.get('/', async (req, res) => {
   let username = req?.username;
   let respones = await getCartItems({ username });
   res.json(respones);
});

router.post('/:foodId', async (req, res) => {
   let { foodId } = req?.params;
   let username = req?.username;
   let respones = await addToCart({ foodId, username });
   res.json(respones);
});

router.delete('/:foodId', async (req, res) => {
   let { foodId } = req?.params;
   let username = req?.username;
   let respones = await removeFromCart({ foodId, username });
   res.json(respones);
});

module.exports = router;
