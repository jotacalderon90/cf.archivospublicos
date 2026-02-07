'use strict';

const { z } = require('zod');

const validator = require('../validator');

module.exports = {
  
  total: z.object({
    id: validator.b64,
  }),
  
  collection: z.object({
    id: validator.b64,
  }),
  
  read: z.object({
    id: validator.b64,
  }),
  
  download: z.object({
    id: validator.b64,
  }),
  
  get: z.object({
    id: validator.b64,
  })
  
}