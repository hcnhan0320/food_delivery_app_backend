var express = require('express');
const {
   addFavorite,
   removeFavorite,
   getFavorites,
} = require('../services/favorite.service');
var router = express.Router();

router.get('/', async (req, res) => {
   let username = req?.username;
   let respones = await getFavorites({ username });
   res.json(respones);
});

router.post('/:tourId', async (req, res) => {
   let { tourId } = req?.params;
   let username = req?.username;
   let respones = await addFavorite({ tourId, username });
   res.json(respones);
});

router.delete('/:tourId', async (req, res) => {
   let { tourId } = req?.params;
   let username = req?.username;
   let respones = await removeFavorite({ tourId, username });
   res.json(respones);
});

module.exports = router;
