'use strict';

const controlador = require('./lib/02.views/controller');

module.exports = {
  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Views
   *     summary: vista de inicio
   *     description: vista de inicio
   */
  //@route('/')
  //@method(['get'])
  index: function (req, res) {
    controlador.index(req, res);
  },
};
