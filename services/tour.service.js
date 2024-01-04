const { mongoConfig } = require('../config');
const { Tour } = require('../model/tourModel');
const MongoDB = require('./mongodb.service');
var ObjectId = require('mongodb').ObjectId;

const getAllTours = async (query) => {
   try {
      const { page = 1, pageSize = 5, sort = null, search = '' } = query;
      console.log('query', query);

      const generatSort = () => {
         const sortParsed = JSON.parse(sort);

         const sortFormat = {
            [sortParsed.field]: sortParsed.sort == 'desc' ? -1 : 1,
         };
         return sortFormat;
      };

      const sortFormatted = Boolean(sort) ? generatSort() : {};
      let tours = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .aggregate([
            { $sort: sortFormatted },
            {
               $match: {
                  $or: [
                     // { total: { $regex: '323' } },
                     { title: { $regex: search } },
                  ],
               },
            },

            { $skip: page * pageSize },
            { $limit: parseInt(pageSize) },
         ])
         .toArray();
      let total = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .countDocuments({
            title: { $regex: search, $options: 'i' },
         });

      if (tours && tours?.length > 0) {
         return {
            status: true,
            message: 'tours found successfully',
            tours: tours,
            total: total,
         };
      } else {
         return {
            status: false,
            message: 'No tours found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Tour finding failed',
         error: `Tour finding failed: ${error?.message}`,
      };
   }
};

const getOneTourById = async (tourId) => {
   try {
      let tour = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .aggregate([
            {
               $match: {
                  _id: new ObjectId(tourId),
               },
            },
         ])
         .toArray();
      if (tour && tour?.length > 0) {
         return {
            status: true,
            message: 'Tour found successfully',
            data: tour[0],
         };
      } else {
         return {
            status: false,
            message: 'No tour found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Tour finding failed',
         error: `Tour finding failed: ${error?.message}`,
      };
   }
};

const getTourByCategory = async (category) => {
   try {
      let tour = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .aggregate([
            {
               $match: {
                  category: category,
               },
            },
         ])
         .toArray();
      if (tour && tour?.length > 0) {
         return {
            status: true,
            message: 'Tour found successfully',
            data: tour,
         };
      } else {
         return {
            status: false,
            message: 'No tour found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Tour finding failed',
         error: `Tour finding failed: ${error?.message}`,
      };
   }
};

const createTour = async (tourInfo, images) => {
   try {
      let category = tourInfo.category.split(',');
      if (
         !tourInfo?.code ||
         !tourInfo?.title ||
         !tourInfo?.transport ||
         !tourInfo?.adult ||
         !tourInfo?.children ||
         !tourInfo?.duration ||
         !tourInfo?.schedule ||
         !tourInfo?.type ||
         !tourInfo?.departure ||
         !tourInfo?.destination
      )
         return { status: false, message: 'Please fill up all fields' };

      let tourObj = new Tour({
         code: tourInfo?.code,
         title: tourInfo?.title,
         transport: tourInfo?.transport,
         duration: tourInfo?.duration,
         schedule: tourInfo?.schedule,
         type: tourInfo?.type,
         departure: tourInfo?.departure,
         destination: tourInfo?.destination,
         category: category,
         image: images,
         price: Object({
            adult: tourInfo?.adult,
            children: tourInfo?.children,
         }),
      });

      let savedTour = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .insertOne(tourObj);

      if (savedTour && savedTour.insertedId) {
         return {
            status: true,
            message: 'Add new tour successfully',
         };
      } else {
         return {
            status: false,
            message: 'Add new tour failed',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Add new tour failed',
         error: `Add new tour failed: ${error?.message}`,
      };
   }
};

module.exports = { getAllTours, getOneTourById, createTour, getTourByCategory };
