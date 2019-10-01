const debug = require('debug')('app-ctrl-frontpage');
const request = require('request');

exports.getFrontPage = (req, res) => {
    const path = '/api/posts';
    const url = `${process.env.API_SERVER}:${process.env.PORT}${path}`;
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
    const url = `${process.env.API_SERVER}:${process.env.PORT}${path}/${pageNumber}`;
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
    const url = `${process.env.API_SERVER}:${process.env.PORT}${path}${stub}`;
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
           body.url = `${process.env.API_SERVER}:${process.env.PORT}/${stub}`
           res.render('post', {data:body});
       }
    });
};