var express = require('express');
var router = express.Router();
const {
   addBooking,
   getTransactions,
   getBookingStats,
   getIncomeStats,
   getWeeklyStats,
   getTransactionsByUser,
} = require('../services/booking.service');

router.get('/transactions', async (req, res, next) => {
   let query = req.query;
   let response = await getTransactions(query);
   res.json(response);
});

router.get('/transactions-user/:userId', async (req, res, next) => {
   let userId = req.params.userId;
   let response = await getTransactionsByUser(userId);
   res.json(response);
});

router.get('/stats', async (req, res, next) => {
   let response = await getBookingStats();
   res.json(response);
});

router.get('/weekly-stats', async (req, res, next) => {
   let response = await getWeeklyStats();
   res.json(response);
});

router.get('/income/stats', async (req, res, next) => {
   let response = await getIncomeStats();
   res.json(response);
});

router.post('/', async (req, res, next) => {
   let body = req.body;
   let response = await addBooking(body);
   res.json(response);
});

module.exports = router;
