'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');
const fs = require('fs');
const constants = require('./constants');

module.exports = {
  favicon: async function (req, res) {
    try {
      const filepath = process.cwd() + '/frontend/' + req.headers.host + '/assets/img/favicon.ico';
      if (!fs.existsSync(filepath)) {
        throw new Error(constants.error.rest.favicon_inexistente);
      } else {
        res.sendFile(filepath);
      }
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.favicon + ' ' + constants.error.controlador);
    }
  },

  robots: async function (req, res) {
    try {
      res.setHeader('content-type', 'text/plain');
      res.send('User-agent: *\n\nDisallow: /');
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.robots + ' ' + constants.error.controlador);
    }
  },
};
