const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
   code: {
      type: String,
      required: true,
   },
   title: {
      type: String,
      required: true,
   },
   discount: {
      type: Number,
   },
   promotion: {
      type: Boolean,
   },

   hot: {
      type: Boolean,
   },
   transport: {
      type: String,
      required: true,
   },
   duration: {
      type: String,
      required: true,
   },
   schedule: {
      type: String,
      required: true,
   },
   type: {
      type: String,
      required: true,
   },
   departure: {
      type: String,
      required: true,
   },
   destination: {
      type: String,
      required: true,
   },
   category: {
      type: Array,
   },
   image: {
      type: Array,
   },
   content: {
      description: {
         type: String,
      },
      addInfo: {
         type: String,
      },
   },
   price: {
      adult: {
         type: Number,
      },
      children: {
         type: Number,
      },
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = { Tour };
