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
      return entries.filter((dirent) => dirent.isFile()).length;
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

      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      const respuesta = entries.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);

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

  read: async function (input) {
    try {
      const fileContent = await fs.promises.readFile(filemanager.get(input.id, input.host), 'utf8');
      return fileContent;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.read + ' ' + constants.error.servicio
      );
    }
  },

  download: async function (input) {
    try {
      return filemanager.get(input.id, input.host);
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.download + ' ' + constants.error.servicio
      );
    }
  },

  get: async function (input) {
    try {
      return filemanager.get(input.id, input.host);
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.get + ' ' + constants.error.servicio
      );
    }
  },
};
