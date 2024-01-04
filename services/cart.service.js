const MongoDb = require('./mongodb.service');
const { mongoConfig } = require('../config');

const addToCart = async ({ foodId, username }) => {
   try {
      let updateCart = await MongoDb.db
         .collection(mongoConfig.collections.CARTS)
         .updateOne(
            { foodId, username },
            { $inc: { count: 1 } },
            { upsert: true }
         );
      if (updateCart?.modifiedCount > 0 || updateCart?.upsertedCount > 0) {
         let cartResponse = await getCartItems({ username });
         return {
            status: true,
            message: 'Item added to cart successfully',
            data: cartResponse?.data,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Item added to cart failed',
      };
   }
};

const removeFromCart = async ({ foodId, username }) => {
   try {
      let cart = await MongoDb.db
         .collection(mongoConfig.collections.CARTS)
         .findOne({ foodId, username, count: 1 });
      if (cart) {
         await MongoDb.db
            .collection(mongoConfig.collections.CARTS)
            .deleteOne({ foodId, username });
         let cartResponse = await getCartItems({ username });
         return {
            status: true,
            message: 'Item removed from cart successfully',
            data: cartResponse?.data,
         };
      }
      let updateCart = await MongoDb.db
         .collection(mongoConfig.collections.CARTS)
         .updateOne(
            { foodId, username },
            { $inc: { count: -1 } },
            { upsert: true }
         );
      let cartResponse = await getCartItems({ username });
      if (updateCart?.modifiedCount > 0 || updateCart?.upsertedCount > 0) {
         return {
            status: true,
            message: 'Item removed from cart successfully',
            data: cartResponse?.data,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Item removed from cart failed',
      };
   }
};

const getCartItems = async ({ username }) => {
   try {
      let cartItems = await MongoDb.db
         .collection(mongoConfig.collections.CARTS)
         .aggregate([
            {
               $match: {
                  username: username,
               },
            },
            {
               $lookup: {
                  from: 'foods',
                  localField: 'foodId',
                  foreignField: 'id',
                  as: 'food',
               },
            },
            {
               $unwind: {
                  path: '$food',
               },
            },
         ])
         .toArray();
      if (cartItems?.length > 0) {
         let itemsTotal = cartItems
            ?.map((cartItem) => cartItem?.food?.price * cartItem.count)
            .reduce((a, b) => parseFloat(a) + parseFloat(b));
         let discount = 0;
         return {
            status: true,
            message: 'Cart items fetched successfully',
            data: {
               cartItems,
               metaData: {
                  itemsTotal,
                  discount,
                  grandTotal: itemsTotal - discount,
               },
            },
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Cart items fetched failed',
      };
   }
};

module.exports = { addToCart, removeFromCart, getCartItems };
