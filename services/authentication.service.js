const MongoDb = require('./mongodb.service');
const { mongoConfig, tokenSecret } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRegister = async (user) => {
   try {
      if (!user?.username || !user?.email || !user?.password)
         return { status: false, message: 'Please fill up all fields' };

      const passwordHash = await bcrypt.hash(user?.password, 10);

      let userObj = {
         username: user?.username,
         email: user?.email,
         password: passwordHash,
      };
      let savedUser = await MongoDb.db
         .collection(mongoConfig.collections.USERS)
         .insertOne(userObj);

      if (savedUser?.acknowledged && savedUser?.insertedId) {
         let token = jwt.sign(
            { username: userObj?.username, email: userObj?.email },
            tokenSecret,
            { expiresIn: '24h' }
         );
         return {
            status: true,
            message: 'User registered successfully',
            data: token,
         };
      } else {
         return {
            status: false,
            message: 'User registered failed',
         };
      }
      console.log(savedUser);
   } catch (error) {
      console.log(error);
      let errorMessage = 'User registered failed';
      error?.code === 11000 && error?.keyPattern?.username
         ? (errorMessage = 'Username already exist')
         : null;

      error?.code === 11000 && error?.keyPattern?.email
         ? (errorMessage = 'Email already exist')
         : null;
      return {
         status: false,
         message: errorMessage,
         error: error?.toString(),
      };
   }
};

const userLogin = async (user) => {
   try {
      if (!user?.username || !user?.password)
         return { status: false, message: 'Please fill up all fields' };
      let userObj = await MongoDb.db
         .collection(mongoConfig.collections.USERS)
         .findOne({ username: user?.username });
      if (userObj) {
         let isPasswordVerified = await bcrypt.compare(
            user?.password,
            userObj.password
         );
         if (isPasswordVerified) {
            let token = jwt.sign(
               { username: userObj?.username, email: userObj?.email },
               tokenSecret,
               { expiresIn: '24h' }
            );
            return {
               status: true,
               message: 'User login successful',
               data: token,
            };
         } else {
            return {
               status: false,
               message: 'Incorrect password',
            };
         }
      } else {
         return {
            status: false,
            message: 'No user found',
         };
      }
   } catch (error) {
      console.log(error);
      return {
         status: false,
         message: 'User login failed',
         error: error?.toString(),
      };
   }
};

module.exports = { userRegister, userLogin };
