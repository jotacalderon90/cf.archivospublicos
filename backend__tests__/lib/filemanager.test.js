'use strict';

const service = require('../../backend/lib/filemanager');

describe('backend/lib/filemanager', () => {
  const baseDirectory = process.cwd() + '/frontend/assets/';

  describe('get', () => {
    it('debería retornar la ruta correcta para un id en base64 válido', () => {
      const nombreArchivo = 'documento.pdf';
      const id = Buffer.from(encodeURIComponent(nombreArchivo)).toString('base64');
      const resultado = service.get(id);
      expect(resultado).toBe(baseDirectory + nombreArchivo);
    });

    it('debería retornar la ruta correcta para un archivo con ruta anidada', () => {
      const nombreArchivo = 'carpeta/subcarpeta/archivo.jpg';
      const id = Buffer.from(encodeURIComponent(nombreArchivo)).toString('base64');
      const resultado = service.get(id);
      expect(resultado).toBe(baseDirectory + nombreArchivo);
    });

    it('debería retornar la ruta correcta para un archivo con caracteres especiales', () => {
      const nombreArchivo = 'archivo con espacios.pdf';
      const id = Buffer.from(encodeURIComponent(nombreArchivo)).toString('base64');
      const resultado = service.get(id);
      expect(resultado).toBe(baseDirectory + nombreArchivo);
    });

    it('debería comenzar siempre con el directorio base', () => {
      const id = Buffer.from(encodeURIComponent('cualquier.txt')).toString('base64');
      const resultado = service.get(id);
      expect(resultado.startsWith(baseDirectory)).toBe(true);
    });
  });
});
