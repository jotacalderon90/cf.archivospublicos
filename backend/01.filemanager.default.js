"use strict";

const fs = require("fs");
const path = require("path");
const logger = require('cl.jotacalderon.cf.framework/lib/log')('api.01.filemanager.default');
const response = require('cl.jotacalderon.cf.framework/lib/response');
const directory = process.cwd() + "/frontend/assets/";

module.exports = {
	
	//@route('/api/filemanager/folder/full')
	//@method(['get'])
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
		}catch(error){
			logger.error(error);
			response.APIError(req,res,error);
		}
	}
}