import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import Postgresql from './middlewares/postgresql';
import session from 'express-session';
import connect_pg_simple from 'connect-pg-simple';
import csurf from 'csurf';
import cors from 'cors';
import routes from './routes';

const app = express();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const postgresSession = connect_pg_simple(session);
const postgresqlPool = new Postgresql().pool;

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: new postgresSession({
    pool: postgresqlPool,
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: 'auto',
  },
}));
app.use(csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
  },
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

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
  res.render('error', {
    error: {
      status: err.status,
      message: res.locals.message,
    },
  });
});

export default app;
