// load required modules
const express = require('express'),
  bodyParser = require('body-parser'),
  config = require('./app/config'),
  logger = require('morgan'),
  expressHandlebars = require('express-handlebars'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  methodOverride = require('method-override'),
  cors = require('cors');

// init the App
const app = express();

// get the http server and socket.io
const server = require('http').Server(app);

// connect

// mongodb connection ########################################
mongoose
  .connect(config.dbUrl)
  .then(() => console.log('Mongodb Connected....'))
  .catch(error => console.error(error));

// handlebars middleware
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars'); // https://github.com/ericf/express-handlebars

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(logger('dev'));
app.use(methodOverride('_method'));

// express session and cookieParser ##################
app.use(cookieParser());
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware  ###################################
app.use(passport.initialize());
app.use(passport.session());

// set global variable ###################################
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// google auth #######################################################
require('./app/passport/google')(passport);

// facebook
require('./app/passport/facebook')(passport);

// routes
app.use('/auth', require('./app/routes/auth'));
app.use('/', require('./app/routes/index'));
app.use('/slam', require('./app/routes/slams'));
app.use('/users', require('./app/routes/follow'));
// test route
app.use('/test', require('./app/routes/test')(server));

// custom error
app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});

// handling errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(`<html>
  <head>
  <title>Error</title>
  </head>
  <body>
  <center>
  <h1>${error.message}<h1>
  <strong>${error.status}</strong>
  </center>
  </body>
  
  </html>`);
});

// start the app
server.listen(config.port, () => {
  console.log(`App running on http://localhost:${config.port}`);
});
