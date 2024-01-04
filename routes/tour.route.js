var express = require('express');
var router = express.Router();

const {
   getAllTours,
   getOneTourById,
   searchTour,
   createTour,
   getTourByCategory,
} = require('../services/tour.service');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: './static/images/tour',
   filename: (req, file, cb) => {
      return cb(
         null,
         `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
   },
});

const upload = multer({
   storage: storage,
});

router.get('/', async (req, res) => {
   let query = req.query;
   let respones = await getAllTours(query);
   res.json(respones);
});

router.get('/:tourId', async (req, res) => {
   let tourId = req?.params?.tourId;
   let respones = await getOneTourById(tourId);
   res.json(respones);
});

router.get('/category/:category', async (req, res) => {
   let category = req?.params?.category;
   let respones = await getTourByCategory(category);
   res.json(respones);
});

router.get('/search', async (req, res) => {
   let query = req.query;
   let respones = await searchTour(query);
   res.json(respones);
});

router.post('/create-tour', upload.array('tourImg'), async (req, res) => {
   try {
      let tour = req.body;
      let images = req.files.map((image) => image.filename);
      console.log(images);
      if (images && images.length > 0) {
         let respones = await createTour(tour, images);
         res.json(respones);
      } else {
         res.json({
            status: false,
            message: 'No file upload',
         });
      }
   } catch (e) {
      res.json({
         status: false,
         message: 'fail',
         error: e,
      });
   }
});

module.exports = router;
