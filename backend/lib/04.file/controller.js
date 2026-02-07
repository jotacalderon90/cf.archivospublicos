'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {
  
  total: async function(req, res) {
    try{
      
      const parseResult = validator.total.safeParse(req.params);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.total(parseResult.data);
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.total + ' ' + constants.error.controlador);
		}
  },
  
  collection: async function(req, res) {
    try{
      
      const parseResult = validator.collection.safeParse(req.params);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.collection(parseResult.data);
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.collection + ' ' + constants.error.controlador);
		}
  },
  
  read: async function(req, res) {
    try{
      
      const parseResult = validator.read.safeParse(req.params);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.read(parseResult.data);
      
      res.send({data: respuesta});
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
		}
  },
  
  download: async function(req, res) {
    try{
      
      const parseResult = validator.download.safeParse(req.params);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.download(parseResult.data);
      
      res.download(respuesta);
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.download + ' ' + constants.error.controlador);
		}
  },
  
  get: async function(req, res) {
    try{
      
      const parseResult = validator.get.safeParse(req.params);
      
      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }
      
      const respuesta = await service.get(parseResult.data);
      
      res.sendFile(respuesta);
      
		}catch(error){
			logger.error(error);
			response.renderError(req, res, constants.error.rest.get + ' ' + constants.error.controlador);
		}
  }
  
}