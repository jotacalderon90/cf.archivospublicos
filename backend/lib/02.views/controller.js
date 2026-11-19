'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');

const domain = require('../domain');

module.exports = {
  index: async function (req, res) {
    try {
      res.render('filemanager/_', {
        __hostArchivosPublicos: domain.getHostArchivosPublicos(req)
      });
    } catch (error) {
      logger.error(error, req.headers.host);
      response.APIError(req, res, constants.error.rest.index + ' ' + constants.error.controlador);
    }
  },
};
