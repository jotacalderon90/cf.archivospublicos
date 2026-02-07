'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const constants = require('./constants');
const filemanager = require('../filemanager');

module.exports = {
  
  total: async function(input) {
    try {
      
      const dir = filemanager.get(input.id);
      
      return fs.readdirSync(dir , 'utf8').filter(function(row){
				return fs.statSync(path.join(dir,row)).isFile();
			}).length;
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.total + ' ' + constants.error.servicio);
    }
  },
  
  collection: async function(input) {
    try {
      
      const dir = filemanager.get(input.id);
      
			return fs.readdirSync(dir, 'utf8').filter(function(row){
				return fs.statSync(path.join(dir,row)).isFile();
			});
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.collection + ' ' + constants.error.servicio);
    }
  },
  
  read: async function(input) {
    try {
      
      return fs.readFileSync(filemanager.get(input.id), 'utf8');
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },
  
  download: async function(input) {
    try {
      
      return filemanager.get(input.id);
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.download + ' ' + constants.error.servicio);
    }
  },
  
  get: async function(input) {
    try {
      
      return filemanager.get(input.id);
      
    }catch(error) {
      logger.error(error);
      throw new Error((error instanceof Error) ? error.message : constants.error.rest.get + ' ' + constants.error.servicio);
    }
  }
  
}