const mongoose = require('mongoose');
const debug = require('debug')('DB');

let dbURI = process.env.MONGODB_URI;

debug('connecting to MongoDB @' + dbURI);

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  debug(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  debug(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  debug(`Mongoose disconnected`);
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    debug(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

/*
    load models
 */
require('./post');
require('./api');
require('./users');
require('./settings');
