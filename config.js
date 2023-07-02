const config = require('./package.json').projectConfig;

module.exports = {
   mongoConfig: {
      connectionUrl: config.mongoConnectionUrl,
      database: 'food_delivery_db',
      collections: {
         USERS: 'users',
      },
   },
   serverConfig: {
      ip: config.serverIp,
      port: config.serverPort,
   },
   tokenSecret: 'food_delivery_secret',
};
