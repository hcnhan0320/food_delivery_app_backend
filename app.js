var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication');
var userRouter = require('./routes/user.route');
var restaurantRouter = require('./routes/restaurant.route');
var cartRouter = require('./routes/cart.route');
var favoriteRouter = require('./routes/favorite.route');
var categoryRouter = require('./routes/category.route');
var tourRouter = require('./routes/tour.route');
var searchRouter = require('./routes/search.route');
var paymentRouter = require('./routes/payment.route');
var bookingRouter = require('./routes/booking.route');
var uploadRoute = require('./routes/upload.route');

const MongoDb = require('./services/mongodb.service');
MongoDb.connectToMongoDB();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static('static'));

// Token verification middleware for all routes except /api/tour and /api/search
app.use('*', (req, res, next) => {
   if (
      req.originalUrl.includes('/api/tour') ||
      req.originalUrl.includes('/api/search')
   ) {
      // Skip token verification for /api/tour and /api/search
      next();
   } else {
      require('./services/authentication.service').tokenVerification(
         req,
         res,
         next
      );
   }
});

// app.use('*', require('./services/authentication.service').tokenVerification);
app.use(
   '/refresh-token',
   require('./services/authentication.service').tokenRefresh
);
app.use('/', indexRouter);
app.use('/api', authenticationRouter);
app.use('/api/user', userRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/cart', cartRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/category', categoryRouter);
app.use('/api/tour', tourRouter);
app.use('/api/search', searchRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/upload', uploadRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;
