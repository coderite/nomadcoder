const request = require('request');
const debug = require('debug')('app-ctrl-auth');
const store = require('store');

const atob = str => Buffer.from(str, 'base64').toString('binary');

// check if its production or not and return the right URI
function getServer() {
    if(process.env.NODE_ENV == 'production') {
        return `${process.env.API_SERVER}`;
    } else {
        return `${process.env.API_SERVER}:${process.env.PORT}`;
    }
}

const getLoginPage = (req, res) => {
    debug('getting login page');
    const data = {
        error:req.query.err,
    };

    res.render('signin', data);
};

const login = (req, res) => {
    const {username, password} = req.body;
    debug('trying to log in ' + username);

    if(!username || !password) {
        res.redirect('/login?err=val');
    }

    const path = '/api/login';
    const url =  `${getServer()}${path}`;
    const requestOptions = {
        url:url,
        method: 'POST',
        json: {
            username: username,
            password: password
        }
    };
    debug('POST request to ' + url);

    request(requestOptions, (err, response, body) => {
        if(err) {
            return res.status(400).json(err);
        }
        debug('status code after login attempt: ' + response.statusCode);

        if(response.statusCode === 401) {
            debug('401 during login attempt');
            res.redirect('/login?err=auth');
        }

        if(!err && response.statusCode === 200) {
            const token = store.get('token');
            debug('reading token ' + token);
            // return res.render('admin/dashboard', body);
            return res.redirect('/admin');
        }
    });
};

const logout = (req, res) => {
    req.logout();
    store.remove('token');
    const token = store.get('token');
    if(!token) {
        debug('logged user out');
    }
    res.redirect('/');
};

const isLoggedIn = (req, res, next) => {
  debug('isLoggedIn check');
  const token = store.get('token');

  if(token) {
      debug(`found token: ${token}`);
      const payload = JSON.parse(atob(token.split('.')[1]));
      debug(`payload ${JSON.stringify(payload)}`);
      if(payload.exp > (Date.now() / 1000)) {
          debug('expiry date time greater than current date time:' + payload.exp);
          req.payload = payload;
          next();
      } else {
          debug('token has expired');
          return res.redirect('/login');
      }
  } else {
      debug('not token found');
      return res.redirect('/login');
  }
};

module.exports = {
    getLoginPage,
    login,
    logout,
    isLoggedIn
};