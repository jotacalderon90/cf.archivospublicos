'use strict';

const controlador = require('./lib/04.file/controller');

module.exports = {
	
  /**
   * @swagger
   * /api/filemanager/file/:id/total:
   *   get:
   *     tags:
   *       - File
   *     summary: total de archivos
   *     description: total de archivos
   */
	//@route('/api/filemanager/file/:id/total')
	//@method(['get'])
	total: async function(req,res){
		controlador.total(req, res);
	},
		
  /**
   * @swagger
   * /api/filemanager/file/:id/collection:
   *   get:
   *     tags:
   *       - File
   *     summary: colección de archivos
   *     description: colección de archivos
   */
	//@route('/api/filemanager/file/:id/collection')
	//@method(['get'])
	collection: async function(req,res){
		controlador.collection(req, res);
	},
	
  /**
   * @swagger
   * /api/filemanager/file/:id:
   *   get:
   *     tags:
   *       - File
   *     summary: leer contenido de archivo
   *     description: leer contenido de archivo
   */
	//@route('/api/filemanager/file/:id')
	//@method(['get'])
	read: async function(req,res){
		controlador.read(req, res);
	},
	
  /**
   * @swagger
   * /api/filemanager/file/:id/download:
   *   get:
   *     tags:
   *       - File
   *     summary: descargar archivo
   *     description: descargar archivo
   */
	//@route('/api/filemanager/file/:id/download')
	//@method(['get'])
	download: async function(req,res){
		controlador.download(req, res);
	},
	
  /**
   * @swagger
   * /api/filemanager/file/:id/getfile:
   *   get:
   *     tags:
   *       - File
   *     summary: leer archivo directamente
   *     description: leer archivo directamente
   */
	//@route('/api/filemanager/file/:id/getfile')
	//@method(['get'])
	get: async function(req,res){
		controlador.get(req, res);
	}
}