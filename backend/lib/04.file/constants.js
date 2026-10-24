'use strict';

const constants = require('../constants');

const _constants = { ...constants };

_constants.error.rest.total = 'Error al obtener total de archivos';
_constants.error.rest.collection = 'Error al obtener colleccion de archivos';
_constants.error.rest.read = 'Error al leer archivo';
_constants.error.rest.download = 'Error al descargar archivo';
_constants.error.rest.get = 'Error al obtener archivo';

module.exports = _constants;
