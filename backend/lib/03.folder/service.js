'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const filemanager = require('../filemanager');

const constants = require('./constants');

module.exports = {
  total: async function (input) {
    try {
      const dir = filemanager.get(input.id, input.host);

      const entries = await fs.promises.readdir(dir, { withFileTypes: true });

      return entries.filter((dirent) => !dirent.isFile()).length;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.total + ' ' + constants.error.servicio
      );
    }
  },

  collection: async function (input) {
    try {
      const dir = filemanager.get(input.id, input.host);

      const respuesta = (await fs.promises.readdir(dir, { withFileTypes: true }))
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      return respuesta;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.collection + ' ' + constants.error.servicio
      );
    }
  },
};
