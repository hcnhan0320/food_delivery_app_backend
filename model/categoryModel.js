const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   parentId: {
      type: ObjectId,
      default: null,
   },
   categoryName: {
      type: String,
      required: true,
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

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };
