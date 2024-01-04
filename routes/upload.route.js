var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
   destination: './static/images/user',
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

router.post('/', upload.single('profile'), async (req, res, next) => {
   res.json({
      status: true,
      profile_url: `${req.file.filename}`,
   });
});

module.exports = router;
