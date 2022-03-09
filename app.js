(async function(){
	const logger = require('./lib/log')('server');
	logger.info('ini code');
	
	try{
		
		logger.info('import fs');
		const fs = require('fs');
		
		logger.info('import express');
		const ex = require('express');
		const express = ex();
		
		logger.info('import compression');
		const compression = require('compression');
		express.use(compression());
		
		logger.info('import helmet');
		const helmet = require('helmet');
		express.use(helmet());

		logger.info('import cors');
		const cors = require('cors');
		express.use(cors());
		
		express.use(function(req,res,next){
			logger.request(req);
			next();
		});
		
		logger.info('public default folder');
		express.use('/', ex.static(__dirname + '/frontend'));
		
		express.use(function(req,res,next){
			logger.info("404 " + req.originalUrl);
			res.sendStatus(404);
		});

		logger.info('import http');
		const http = require('http');
		const server = http.Server(express);
		
		logger.info('start server');
		server.listen(80, function(){
			logger.info("server started in 80 port");
		});
		
	}catch(e){
		logger.info(e);
	}
})();