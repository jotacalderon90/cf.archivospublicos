'use strict';

const validator = require('../../backend/lib/validator');

describe('backend/lib/validator - b64', () => {
  describe('casos válidos', () => {
    it('debería aceptar un base64 válido', () => {
      const valor = Buffer.from('hola').toString('base64'); // 'aG9sYQ=='
      const resultado = validator.b64.safeParse(valor);
      expect(resultado.success).toBe(true);
    });
  });

  describe('casos inválidos', () => {
    it('debería rechazar un string vacío', () => {
      const resultado = validator.b64.safeParse('');
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('id es requerido');
    });

    it('debería rechazar un string que no es base64', () => {
      const resultado = validator.b64.safeParse('no-es-base64!!');
      expect(resultado.success).toBe(false);
      expect(resultado.error.issues[0].message).toBe('id debe ser un string en base64 válido');
    });

    it('debería rechazar un valor nulo', () => {
      const resultado = validator.b64.safeParse(null);
      expect(resultado.success).toBe(false);
    });

    it('debería rechazar un número', () => {
      const resultado = validator.b64.safeParse(123);
      expect(resultado.success).toBe(false);
    });
  });
});
