const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
   tourId: {
      type: ObjectId,
      required: true,
   },
   customerId: {
      type: ObjectId,
      required: true,
   },
   adult: {
      type: Number,
      required: true,
   },
   children: {
      type: Number,
      required: true,
   },

   departureDay: {
      type: Date,
   },
   departure: {
      type: String,
      required: true,
   },
   total: {
      type: Number,
      required: true,
   },
   payment: {
      type: String,
      required: true,
   },
   status: {
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

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };
