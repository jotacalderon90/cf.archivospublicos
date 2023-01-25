"use strict";

const logger = require('./lib/log')('route.filemanager.default');
const response = require('./lib/response');
const accesscontrol = require('./lib/accesscontrol');

const onError = function(req,res,e){
	logger.info('ERROR:' + e.toString());
	logger.info(e);
	response.APIError(req,res,e);
}

module.exports = {
	
	//@route('/api/account')
	//@method(['get'])
	account: async function(req,res){
		try{
			req.user = await accesscontrol.getUser(req);
			res.send({data: req.user});
		}catch(e){
			onError(req,res,e);
		}
	}
}