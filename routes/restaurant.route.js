var express = require('express');
const {
   getAllRestaurant,
   getOneRestaurantById,
} = require('../services/restaurant.service');
var router = express.Router();

router.get('/', async (req, res) => {
   let respones = await getAllRestaurant();
   res.json(respones);
});

router.get('/:restaurantId', async (req, res) => {
   let restaurantId = req?.params?.restaurantId;
   let respones = await getOneRestaurantById(restaurantId);
   res.json(respones);
});

module.exports = router;
