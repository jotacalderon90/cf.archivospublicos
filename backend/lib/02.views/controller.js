'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');
const constants = require('./constants');

module.exports = {
  
  index: async function(req, res) {
    try{
      res.render('filemanager/_');
		}catch(error){
			logger.error(error);
			response.APIError(req,res,constants.error.rest.index + ' ' + constants.error.controlador);
		}
  }
  
}