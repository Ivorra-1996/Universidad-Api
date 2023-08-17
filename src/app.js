var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var institutosRouter = require('./routes/instituto');
var alumnosRouter = require('./routes/alumnos');
var profesorRouter = require('./routes/profesor');
var loggin = require('./routes/loggin');


var app = express();

const url = "/Api/Universidad";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(`${url}/carreras`, carrerasRouter);
app.use(`${url}/materias`, materiasRouter);
app.use(`${url}/institutos`, institutosRouter);
app.use(`${url}/alumnos`, alumnosRouter);
app.use(`${url}/profesores`, profesorRouter);
app.use(`${url}/loggin`,loggin);

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
