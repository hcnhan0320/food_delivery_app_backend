const config = require('./package.json').projectConfig;

module.exports = {
   mongoConfig: {
      connectionUrl: config.mongoConnectionUrl,
      database: 'food_delivery_db',
      collections: {
         CATEGORIES: 'categories',
         USERS: 'users',
         RESTAURENTS: 'restaurants',
         CARTS: 'carts',
         TOURS: 'tours',
         FAVORITES: 'favorites',
         BOOKING: 'booking',
      },
   },
   serverConfig: {
      ip: config.serverIp,
      port: config.serverPort,
   },
   tokenSecret: 'food_delivery_secret',
};
