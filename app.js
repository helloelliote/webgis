import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import helmet from 'helmet';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

var app = express();

// view engine setup
/**
 * @default ./views/layouts a Handlebars template with a {{{body}}} placeholder.
 * @default /views/partials
 * @link https://github.com/express-handlebars/express-handlebars
 * @example https://github.com/express-handlebars/express-handlebars/tree/master/examples/advanced
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', exphbs({ extname: '.html' }));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
