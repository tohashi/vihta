'use strict';

const render = require('../lib/render');

function *index(next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  this.body = yield render('home');
}

module.exports = {
  index
};
