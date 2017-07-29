'use strict';

const Koa = require('koa');
const route = require('koa-route');
const logger = require('koa-logger');
const serve = require('koa-static')
const ENV  = require('./env.js');
const app = module.exports = new Koa();
const home = require('./controllers/home');
const viewer = require('./controllers/viewer');
const photos = require('./controllers/photos');

app.use(logger());

app.use(async function(ctx, next){
  try {
    await next();
  } catch (err) {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      ctx.body = 'cant haz that';
    } else {
      throw err;
    }
  }
});


app.use(route.get('/', home.index));
app.use(route.get('/list', home.index));
app.use(route.get('/viewer', viewer.index));

app.use(route.get('/photos', photos.index));
app.use(route.post('/photos', photos.create));
app.use(route.delete('/photos', photos.destroy));

app.use(serve('.'));

app.listen(ENV.PORT);

console.log(`listening on port ${ENV.PORT}`);
