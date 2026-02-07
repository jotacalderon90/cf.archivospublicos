'use strict';

const { z } = require('zod');

module.exports = {
  b64: z
    .string()
    .trim()
    .min(1, 'id es requerido')
    .refine(
      (val) => {
        try {
          return Buffer.from(val, 'base64').toString('base64') === val;
        } catch {
          return false;
        }
      },
      { message: 'id debe ser un string en base64 válido' }
    )
}