const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');
const debug = require('debug')('api-ctrl-settings');

const getSettings = (req, res) => {
    debug('API settings call');
    Settings.findOne({}).exec((err, settings) => {
        if(err) {
            return res.status(400).json(err);
        } else if(!settings) {
            return res.status(404).json({'message':'settings not found'});
        }
        debug('found settings on the API');
        return res.status(200).json(settings);
    });
};

const updateSettings = (req, res) => {
    const {maintenance_mode, google_indexing, author_registration, page_post_limit} = req.body;

    Settings.findOne({}).exec((err, settings) => {
       if(err) {
           debug(err);
           return res.status(400).json(err);
       } else if(!settings) {
           debug('no settings found in api');
           return res.status(404).json({'message':'no settings found'});
       }

       debug('settings found');
       debug(settings);

       settings.maintenance_mode = maintenance_mode;
       settings.google_indexing = google_indexing;
       settings.author_registration = author_registration;
       settings.page_post_limit = page_post_limit;



       debug('attempting to save settings');
       settings.save((err, settings) => {
          if(err) {
              debug(err);
              return res.status(400).json(err);
          } else if(!settings) {
              debug('no settings found');
              return res.status(404).json({'message':'no settings found'});
          }
          debug('all good');
          res.status(201).json(settings);
       });
    });
};

const isMaintenanceMode = (req, res) => {
    Settings.findOne({}).exec((err, settings) => {
        if(err) {
            debug(err);
            return res.status(400).json(err);
        } else if(!settings) {
            debug('no settings found');
            return res.status(404).json({'message':'no settings found'});
        }
        return res.status(200).json({'maintenance_mode':settings.maintenance_mode});
    });
};

const isGoogleIndexing = (req, res) => {
    Settings.findOne({}).exec((err, settings) => {
        if(err) {
            debug(err);
            return res.status(400).json(err);
        } else if(!settings) {
            debug('no settings found');
            return res.status(404).json({'message':'no settings found'});
        }
        return res.status(200).json({'maintenance_mode':settings.maintenance_mode});
    });
};

module.exports = {
    getSettings,
    updateSettings,
    isMaintenanceMode,
    isGoogleIndexing
};