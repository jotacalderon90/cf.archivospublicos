'use strict';

jest.mock('cl.jotacalderon.cf.framework/lib/log', () => () => ({
  error: jest.fn(),
}));

jest.mock('cl.jotacalderon.cf.framework/lib/response', () => ({
  APIError: jest.fn(),
}));

jest.mock('../../../backend/lib/01.default/constants', () => ({
  error: {
    rest: { favicon: 'favicon error', robots: 'robots error' },
    controlador: 'controlador error',
  },
}));

const controller = require('../../../backend/lib/01.default/controller');
const response = require('cl.jotacalderon.cf.framework/lib/response');

describe('backend/lib/01.default/controller', () => {
  const testDomain = 'archivospublicos.jotace.cl';

  let req, res;

  beforeEach(() => {
    req = {
      headers: {
        host: testDomain,
      },
    };
    res = {
      sendFile: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('favicon', () => {
    it('debería llamar sendFile con la ruta correcta', async () => {
      await controller.favicon(req, res);
      expect(res.sendFile).toHaveBeenCalledWith(
        process.cwd() + '/frontend/assets/domains/' + testDomain + '/assets/img/favicon.ico'
      );
    });

    it('debería llamar APIError si sendFile lanza un error', async () => {
      res.sendFile.mockImplementation(() => {
        throw new Error('fallo');
      });
      await controller.favicon(req, res);
      expect(response.APIError).toHaveBeenCalled();
    });
  });

  describe('robots', () => {
    it('debería setear el header content-type como text/plain', async () => {
      await controller.robots(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('content-type', 'text/plain');
    });

    it('debería responder con el contenido correcto de robots.txt', async () => {
      await controller.robots(req, res);
      expect(res.send).toHaveBeenCalledWith('User-agent: *\n\nDisallow: /');
    });

    it('debería llamar APIError si send lanza un error', async () => {
      res.send.mockImplementation(() => {
        throw new Error('fallo');
      });
      await controller.robots(req, res);
      expect(response.APIError).toHaveBeenCalled();
    });
  });
});
