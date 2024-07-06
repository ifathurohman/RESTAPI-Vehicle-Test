const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const {decodeToken} = require('./middlewares')
const authRouter = require('./routes/auth');
const brand = require('./routes/vehicleBrand');
const type = require('./routes/vehicleType');
const model = require('./routes/vehicleModel');
const year = require('./routes/vehicleYear');
const price = require('./routes/pricelist');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(decodeToken());

app.use('/auth', authRouter);
app.use('/api', brand);
app.use('/api', type);
app.use('/api', model);
app.use('/api', year);
app.use('/api', price);

// home 
app.use('/', function(req, res){ 
  res.render('index', {
    title: 'Vehicle REST API '
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;