const { ObjectId } = require('mongodb');
const { mongoConfig } = require('../config');
const MongoDB = require('./mongodb.service');
const moment = require('moment');

const getAllCustomers = async () => {
   try {
      let customers = await MongoDB.db
         .collection(mongoConfig.collections.USERS)
         .find()
         .project({ password: 0 })
         .toArray();
      if (customers && customers?.length > 0) {
         return {
            status: true,
            message: 'Customers found successfully',
            data: customers,
         };
      } else {
         return {
            status: false,
            message: 'No customers found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Customers finding failed',
         error: `Customers finding failed: ${error?.message}`,
      };
   }
};

const getUserData = async (username) => {
   try {
      let userObj = await MongoDB.db
         .collection(mongoConfig.collections.USERS)
         .findOne({ username });
      if (userObj) {
         return {
            status: true,
            message: 'User found successfully',
            data: userObj,
         };
      } else {
         return {
            status: false,
            message: 'No user found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'User finding failed',
         error: `User finding failed: ${error?.message}`,
      };
   }
};

const updateUserRole = async (query) => {
   try {
      let userId = query?.userId;
      let role = query?.role;
      if (!userId || !role || userId == null || role == null)
         return {
            status: false,
            message: 'Cant get params',
         };

      let customers = await MongoDB.db
         .collection(mongoConfig.collections.USERS)
         .findOneAndUpdate(
            { _id: ObjectId(userId) },
            { $set: { role: role, updatedAt: new Date() } },
            { returnDocument: 'after' }
         );

      if (customers && customers.ok == 1) {
         return {
            status: true,
            message: 'Update successfully',
            customers,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Updating failed',
         error: `Updating failed: ${error?.message}`,
      };
   }
};

const deleteUser = async (params) => {
   try {
      const userId = params.userId;
      let deletedUser = await MongoDB.db
         .collection(mongoConfig.collections.USERS)
         .deleteOne({ _id: new ObjectId(userId) });
      if (deletedUser?.deletedCount > 0) {
         return {
            status: true,
            message: 'User deleted successfully',
         };
      } else {
         return {
            status: true,
            message: 'User deleted failed',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: error,
      };
   }
};

const getUserStats = async () => {
   const previousMonth = moment()
      .month(moment().month() - 1)
      .set('date', 1)
      .format('YYYY-MM-DD HH:mm:ss');
   try {
      let users = await MongoDB.db
         .collection(mongoConfig.collections.USERS)
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
      if (users) {
         return {
            status: true,
            message: 'Get stats successfull',
            data: users,
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
   getUserData,
   getAllCustomers,
   updateUserRole,
   deleteUser,
   getUserStats,
};
