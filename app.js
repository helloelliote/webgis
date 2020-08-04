import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import postgresql from './middlewares/postgresql';
import session from 'express-session';
import connect_pg_simple from 'connect-pg-simple';
import csurf from 'csurf';
import rateLimiter from './middlewares/rate-limiter';
import cors from 'cors';
import passport from 'passport';
import passportSetup from './middlewares/passport';
import mountRoutes from './routes';

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

const postgresqlSession = connect_pg_simple(session);
const sessionOptions = {
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: new postgresqlSession({
    pool: postgresql.pool,
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: 'auto',
  },
};
app.use(session(sessionOptions));

const csrfOptions = {
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
  },
};
app.use(csurf(csrfOptions));

app.use(rateLimiter);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passportSetup(passport);

mountRoutes(app, passport);

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
  res.render('error', {
    error: {
      status: err.status,
      message: res.locals.message,
    },
  });
});

export default app;
