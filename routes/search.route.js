var express = require('express');
const { searchTour } = require('../services/search.service');
var router = express.Router();

router.get('/', async (req, res) => {
   let query = req.query;
   let respones = await searchTour(query);
   res.json(respones);
});

module.exports = router;
