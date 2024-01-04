const { mongoConfig } = require('../config');
const MongoDB = require('./mongodb.service');

const searchTour = async (query) => {
   try {
      let tours = await MongoDB.db
         .collection(mongoConfig.collections.TOURS)
         .find({ [query.field]: { $regex: query.value, $options: 'i' } })
         .toArray();
      if (tours && tours?.length > 0) {
         count = tours.length;
         return {
            status: true,
            message: 'Tour found successfully',
            data: tours,
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

module.exports = { searchTour };
