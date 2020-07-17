import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import exphbs from 'express-handlebars';
import indexRouter from './routes/index';
import usersRouter from './routes/users';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'build'));
app.set('view engine', 'html');
app.engine('html', exphbs({
  extname: '.html',
  // layoutsDir: path.join(__dirname, '..', 'web', 'demo11', 'dist'),
  // partialsDir: path.join(__dirname, '..', 'web', 'demo11', 'dist', 'partials'),
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
