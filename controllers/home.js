'use strict';

const render = require('../lib/render');

async function index(ctx, next) {
  if (ctx.method !== 'GET') {
    return await next();
  }
  ctx.body = await render('home');
}

module.exports = {
  index
};
