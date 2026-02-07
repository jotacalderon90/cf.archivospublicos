'use strict';

const { z } = require('zod');

const validator = require('../validator');

module.exports = {
  
  total: z.object({
    id: validator.b64,
  }),
  
  collection: z.object({
    id: validator.b64,
  })
}