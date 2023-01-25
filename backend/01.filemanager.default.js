"use strict";

const fs = require("fs");
const path = require("path");

const logger = require('./lib/log')('route.filemanager.default');
const response = require('./lib/response');

const directory = process.cwd() + "/frontend/";

const onError = function(req,res,e){
	logger.info('ERROR:' + e.toString());
	logger.info(e);
	response.APIError(req,res,e);
}

module.exports = {
	
	//@route('/api/filemanager/folder/full')
	//@method(['get'])
	//@roles(['root'])
	fullDirectory: async function(req,res){
		try{
			const getDirectory = function(src, dirbase){
				const tmpDir = fs.readdirSync(src);
				const directory = [];
				for(let i=0;i<tmpDir.length;i++){
					const direct = path.join(src, tmpDir[i]);
					const dir = {text: tmpDir[i], id: dirbase + tmpDir[i], type: (fs.statSync(direct).isDirectory())?"folder":"file"}
					if(fs.statSync(direct).isDirectory()){
						dir.children = getDirectory(direct, dirbase + tmpDir[i] + "/");
					}
					directory.push(dir);
				}
				return directory;
			};
			res.send({data: getDirectory(directory,"/")});
		}catch(e){
			onError(req,res,e);
		}
	}
}