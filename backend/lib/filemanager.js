'use strict';

const directory = process.cwd() + '/frontend/assets/';

const decode = function (value) {
  return decodeURIComponent(Buffer.from(value, 'base64').toString('utf8'));
};

module.exports = {
  get: function (id, host) {
    return directory + host + '/' + decode(id);
  },
};
