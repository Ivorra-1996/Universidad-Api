const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const carrerasRouter = require('./routes/carreras');
const materiasRouter = require('./routes/materias');
const institutosRouter = require('./routes/instituto');
const alumnosRouter = require('./routes/alumnos');
const profesorRouter = require('./routes/profesor');
const loggin = require('./routes/loggin');


const app = express();

const urlV1 = "/Api/Universidad";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(`${urlV1}/carreras`, carrerasRouter);
app.use(`${urlV1}/materias`, materiasRouter);
app.use(`${urlV1}/institutos`, institutosRouter);
app.use(`${urlV1}/alumnos`, alumnosRouter);
app.use(`${urlV1}/profesores`, profesorRouter);
app.use(`${urlV1}/loggin`, loggin);

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
