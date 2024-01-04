const MongoDb = require('./mongodb.service');
const { mongoConfig } = require('../config');
const { Category } = require('../model/categoryModel');
const MongoDB = require('./mongodb.service');

var ObjectId = require('mongodb').ObjectId;

const getCategories = async () => {
   try {
      let categories = await MongoDB.db
         .collection(mongoConfig.collections.CATEGORIES)
         .find()
         .toArray();
      if (categories && categories?.length > 0) {
         return {
            status: true,
            message: 'Categories found successfully',
            data: categories,
         };
      } else {
         return {
            status: false,
            message: 'No categories found',
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Categories finding failed',
         error: `Categories finding failed: ${error?.message}`,
      };
   }
};

const getCategoriesById = async (parentId) => {
   try {
      let categories = await MongoDB.db
         .collection(mongoConfig.collections.CATEGORIES)
         .find({ parentId: new ObjectId(parentId) })
         .toArray();
      if (categories && categories?.length > 0) {
         return {
            status: true,
            message: 'Categories found successfully',
            data: categories,
         };
      } else {
         return {
            status: false,
            message: 'No categories found',
            data: [],
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Categories finding failed',
         error: `Categories finding failed: ${error?.message}`,
      };
   }
};

const addCategory = async (parentId, name) => {
   console.log(parentId, name);
   try {
      let cate = new Category({
         parentId: parentId !== null ? new ObjectId(parentId) : null,
         categoryName: name,
      });

      let insertCategory = await MongoDb.db
         .collection(mongoConfig.collections.CATEGORIES)
         .insertOne(cate);
      if (insertCategory.insertedId) {
         // let favoriteResponse = await getFavorites({ username });
         return {
            status: true,
            message: 'Category added successfully',
            // data: favoriteResponse?.data,
         };
      }
   } catch (error) {
      return {
         status: false,
         message: 'Category added failed',
      };
   }
};

module.exports = { addCategory, getCategories, getCategoriesById };
