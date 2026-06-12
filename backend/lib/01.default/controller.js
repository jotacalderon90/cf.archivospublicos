'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');

const fileCache = new Map();

module.exports = {
  favicon: async function (req, res) {
    try {
      if (fileCache.has(req.headers.host)) {
        res.sendFile(fileCache.get(req.headers.host));
        return;
      }

      const filepath =
        process.cwd() + '/frontend/assets/domains/' + req.headers.host + '/assets/img/favicon.ico';

      const exists = await fs.promises
        .access(filepath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        fileCache.set(req.headers.host, filepath);
        res.sendFile(filepath);
        return;
      }

      throw new Error(constants.error.rest.favicon_inexistente);
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
