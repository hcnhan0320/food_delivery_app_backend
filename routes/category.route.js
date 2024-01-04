var express = require('express');
const {
   addCategory,
   getCategories,
   getCategoriesById,
} = require('../services/category.service');
var router = express.Router();

router.get('/', async (req, res, next) => {
   let response = await getCategories();
   res.json(response);
});

router.post('/:parentId', async (req, res, next) => {
   const { parentId } = req.params;
   let response = await getCategoriesById(parentId);
   res.json(response);
});

router.post('/:parentId/:name', async (req, res, next) => {
   const { parentId, name } = req.params;
   console.log(req.params);
   let response = await addCategory(parentId, name);
   res.json(response);
});

module.exports = router;
