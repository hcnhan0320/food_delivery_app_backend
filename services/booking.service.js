const MongoDb = require('./mongodb.service');
const { mongoConfig } = require('../config');
const { Transaction } = require('../model/transactionsModel');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const getTransactions = async (query) => {
   try {
      const { page = 1, pageSize = 20, sort = null, search = '' } = query;
      console.log('query', query);

      const generatSort = () => {
         const sortParsed = JSON.parse(sort);
         const sortFormatted = {
            [sortParsed.field]: sortParsed.sort == 'asc' ? 1 : -1,
         };
         return sortFormatted;
      };

      const sortFormatted = Boolean(sort) ? generatSort() : {};

      let transactions = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .aggregate([
            { $sort: sortFormatted },
            {
               $match: {
                  $or: [
                     // { total: { $regex: '323' } },
                     { payment: { $regex: search } },
                  ],
               },
            },
            { $skip: page * pageSize },
            { $limit: parseInt(pageSize) },
         ])
         .toArray();
      // .find({
      //    total: { $regex: parseInt('20'), $options: 'i' },
      // })
      // .toArray();
      // .find({
      //    $or: [
      //       { total: { $regex: new RegExp(search, 'i') } },
      //       { customerId: { $regex: new RegExp(search, 'i') } },
      //    ],
      // })
      // .sort(sortFormatted)
      // .skip(page * pageSize)
      // .limit(parseInt(pageSize))
      // .toArray();

      // console.log(transactions);
      let total = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .countDocuments({
            payment: { $regex: search, $options: 'i' },
         });

      if (transactions && transactions?.length > 0) {
         return {
            status: true,
            message: 'Get transactions successfully',
            transactions: transactions,
            total: total,
         };
      } else {
         return {
            status: false,
            message: 'No transactions found',
         };
      }
   } catch (e) {
      return {
         status: false,
         message: 'Get transactions failed',
         error: e?.toString(),
      };
   }
};

const getTransactionsByUser = async (userId) => {
   try {
      let transactions = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .aggregate([
            {
               $match: {
                  customerId: new ObjectId(userId),
               },
            },
         ])
         .toArray();
      if (transactions?.length > 0) {
         return {
            status: true,
            message: 'transactions fetched successfully',
            data: transactions,
         };
      } else {
         return {
            status: false,
            message: 'transactions not found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'transactions fetching failed',
      };
   }
};

const addBooking = async (bookingInfo) => {
   try {
      if (
         !bookingInfo?.tourId ||
         !bookingInfo?.customerId ||
         !bookingInfo?.adult ||
         !bookingInfo?.children ||
         // !bookingInfo?.departureDay ||
         !bookingInfo?.total ||
         !bookingInfo?.departure
      )
         return { status: false, message: 'Please fill up all fields' };

      let infoObj = new Transaction({
         tourId: bookingInfo?.tourId,
         customerId: bookingInfo?.customerId,
         adult: bookingInfo?.adult,
         children: bookingInfo?.children,
         departureDay: bookingInfo?.departureDay,
         departure: bookingInfo?.departure,
         total: bookingInfo?.total,
         payment: bookingInfo?.payment,
         status: bookingInfo?.status,
      });

      let savedInfo = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .insertOne(infoObj);

      let saveCustomer = await MongoDb.db
         .collection(mongoConfig.collections.USERS)
         .updateOne(
            { _id: new ObjectId(bookingInfo?.customerId) },
            {
               $push: {
                  transactions: savedInfo.insertedId,
               },
               $set: {
                  updatedAt: new Date(),
               },
            }
         );

      if (savedInfo.insertedId && saveCustomer.modifiedCount) {
         return {
            status: true,
            message: 'Booking tour successfully',
            // data: savedInfo,
         };
      } else {
         return {
            status: false,
            message: 'Booking tour failed',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Booking tour failed',
         error: error?.toString(),
      };
   }
};

const getBookingStats = async () => {
   const previousMonth = moment()
      .month(moment().month() - 1)
      .set('date', 1)
      .format('YYYY-MM-DD HH:mm:ss');
   try {
      let transactions = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .aggregate([
            {
               $match: { createdAt: { $gte: new Date(previousMonth) } },
            },
            {
               $project: {
                  month: { $month: '$createdAt' },
               },
            },
            {
               $group: {
                  _id: '$month',
                  total: { $sum: 1 },
               },
            },
         ])
         .toArray();
      if (transactions) {
         return {
            status: true,
            message: 'Get stats successfull',
            data: transactions,
         };
      } else {
         return {
            status: true,
            message: 'Get stats fails',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: error,
      };
   }
};

const getIncomeStats = async () => {
   const previousMonth = moment()
      .month(moment().month() - 1)
      .set('date', 1)
      .format('YYYY-MM-DD HH:mm:ss');
   console.log(previousMonth);
   try {
      let income = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .aggregate([
            {
               $match: { createdAt: { $gte: new Date(previousMonth) } },
            },
            {
               $project: {
                  month: { $month: '$createdAt' },
                  sales: '$total',
               },
            },
            {
               $group: {
                  _id: '$month',
                  total: { $sum: '$sales' },
               },
            },
         ])
         .toArray();
      if (income) {
         return {
            status: true,
            message: 'Get stats successfull',
            data: income,
         };
      } else {
         return {
            status: true,
            message: 'Get stats fails',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: error,
      };
   }
};

const getWeeklyStats = async () => {
   const last7Days = moment()
      .month(moment().day() - 7)
      .format('YYYY-MM-DD HH:mm:ss');
   try {
      let weeklyBooking = await MongoDb.db
         .collection(mongoConfig.collections.BOOKING)
         .aggregate([
            {
               $match: { createdAt: { $gte: new Date(last7Days) } },
            },
            {
               $project: {
                  day: { $dayOfWeek: '$createdAt' },
                  sales: '$total',
               },
            },
            {
               $group: {
                  _id: '$day',
                  total: { $sum: '$sales' },
               },
            },
         ])
         .toArray();
      if (weeklyBooking) {
         return {
            status: true,
            message: 'Get stats successfull',
            data: weeklyBooking,
         };
      } else {
         return {
            status: true,
            message: 'Get stats fails',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: error,
      };
   }
};

module.exports = {
   addBooking,
   getTransactions,
   getTransactionsByUser,
   getBookingStats,
   getIncomeStats,
   getWeeklyStats,
};
