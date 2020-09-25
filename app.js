// load env variables first
require('dotenv').config();

const express = require('express');
const app = express();
const debug = require('debug')('app');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const http = require('http');
const helmet = require('helmet');

// needs to be loaded before the DB models
const passport = require('passport');

// connect to the Mongo database
require('./api_server/models/db');
require('./api_server/models/api');
require('./api_server/models/post');
require('./api_server/models/settings');

// needs to be loaded after the DB models
require('./api_server/config/passport');

// constants
const port = process.env.PORT;

const routerApi = require('./api_server/routes/index');
const routerApp = require('./app_server/routes/index');

app.use(helmet());

// set up view engine
app.set('view engine', 'ejs');
app.set('views', 'app_server/views');

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public/css'));
app.use(express.static('public/images'));
app.use(express.static('public/js'));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// initialize passport after static routes
app.use(passport.initialize());

/*
 *  ROUTING
 */
app.use('/api', routerApi);
app.use('/', routerApp);

// allow CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With-Content-Type, Accept, Authorization'
  );
  next();
});

// catch all errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Forbidden' });
  }
});

// heroku hack to prevent free tier from idling
setInterval(function () {
  http.get('http://www.nomadcoder.io');
}, 300000);

if (process.env.NODE_ENV === 'production') {
  app.listen(port, () => debug(`listening on ${process.env.API_SERVER}`));
} else {
  app.listen(port, () =>
    debug(`listening on ${process.env.API_SERVER}:${port}`)
  );
}
