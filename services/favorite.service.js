const MongoDb = require('./mongodb.service');
const { mongoConfig } = require('../config');

var ObjectId = require('mongodb').ObjectId;

const addFavorite = async ({ tourId, username }) => {
   try {
      let insertFavorite = await MongoDb.db
         .collection(mongoConfig.collections.FAVORITES)
         .insertOne({ tourId: new ObjectId(tourId), username });

      if (insertFavorite.insertedId) {
         let favoriteResponse = await getFavorites({ username });
         return {
            status: true,
            message: 'Tour added to favorite successfully',
            data: favoriteResponse?.data,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Tour added to favorite failed',
      };
   }
};

const removeFavorite = async ({ tourId, username }) => {
   try {
      let removedFavorite = await MongoDb.db
         .collection(mongoConfig.collections.FAVORITES)
         .deleteOne({ tourId: new ObjectId(tourId), username });
      if (removedFavorite?.deletedCount > 0) {
         let favoriteResponse = await getFavorites({ username });
         return {
            status: true,
            message: 'Favorite removed successfully',
            data: favoriteResponse?.data,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Favorite removed  failed',
      };
   }
};

const getFavorites = async ({ username }) => {
   try {
      let favorites = await MongoDb.db
         .collection(mongoConfig.collections.FAVORITES)
         .aggregate([
            {
               $match: {
                  username: username,
               },
            },
            {
               $lookup: {
                  from: 'tours',
                  localField: 'tourId',
                  foreignField: '_id',
                  as: 'tour',
               },
            },
            {
               $unwind: {
                  path: '$tour',
               },
            },
         ])
         .toArray();
      if (favorites?.length > 0) {
         return {
            status: true,
            message: 'Favorites fetched successfully',
            data: favorites,
         };
      } else {
         return {
            status: false,
            message: 'Favorites not found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Favorites fetching failed',
      };
   }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
