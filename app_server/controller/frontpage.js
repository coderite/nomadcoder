const debug = require('debug')('app-ctrl-frontpage');
const request = require('request');

// check if its production or not and return the right URI
function getServer() {
    if(process.env.NODE_ENV == 'production') {
        return `${process.env.API_SERVER}`;
    } else {
        return `${process.env.API_SERVER}:${process.env.PORT}`;
    }
}


exports.getFrontPage = (req, res) => {
    const path = '/api/posts';
    const url = `${getServer()}${path}`;
    debug('getting ' + url);

    const queryOptions = {
      url: url,
      method: 'GET',
      json:{},
    };

    request(queryOptions, (err, response, body) => {
        if(!err && response.statusCode === 200) {
            debug('request received with status code ' + response.statusCode);
            debug('rendering page');
            return res.render('index', body);
        }

       if(err) {
           debug(err);
           return res.status(400).json(err);
       }
    });
};

exports.getFrontPagePaginate = (req, res) => {
    const { pageNumber } = req.params;
    debug('page number: ' + pageNumber);

    const path = '/api/posts';
    const url = `${getServer()}${path}/${pageNumber}`;
    debug(`getting paginate url ${url}`);
    const queryOptions = {
        url: url,
        method: 'GET',
        json:{},
    };

    request(queryOptions, (err, {statusCode}, body) => {
        debug('request sent ' + statusCode);
       if(err || statusCode !== 200) {
           return res.status(statusCode).json(err);
       }

       if(statusCode === 200 && body) {
           debug('okay, lets go');
           res.render('index', body);
       }
    });
};

exports.getPageFromStub = (req, res) => {
    const { stub } = req.params;
    debug('finding stub: ' + stub);

    const path = '/api/post/';
    const url = `${getServer()}${path}${stub}`;
    debug(`using URL: ${url}`);
    const queryOptions = {
        url: url,
        method: 'GET',
        json: {},
    };

    request(queryOptions, (err, response, body) => {
       if(err) {
           return res.status(400).json(err);
       } else if(!body) {
           return res.status(404).json({'message': 'post not found'});
       }

       if(response.statusCode === 200) {
           body.url = `${getServer()}/${stub}`
           res.render('post', {data:body});
       }
    });
};