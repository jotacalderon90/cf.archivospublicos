"use strict";

const fs = require('fs');
const path = require('path');

const logger = require('./lib/log')('router.04.01.background');
const response = require('./lib/response');

module.exports = {
	
	//@route('/api/background/collection')
	//@method(['get'])
	collection: async function(req,res){
		try{
			const directory = 'media/img/background';
			res.json({data: fs.readdirSync(process.cwd() + '/frontend/' + directory,"utf8").filter((row)=>{
				return fs.statSync(path.join(process.cwd() + '/frontend/' + directory,row)).isFile();
			}).map((r)=>{return directory + '/' + r})});
		}catch(e){
			logger.info('ERROR:' + e.toString());
			logger.info(e);
			response.APIError(res,e);
		}
	}
};