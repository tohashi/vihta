'use strict';

const koa = require('koa');
const route = require('koa-route');
const logger = require('koa-logger');
const serve = require('koa-static')
const ENV  = require('./env.js');
const app = module.exports = koa();
const home = require('./controllers/home');
const viewer = require('./controllers/viewer');
const photos = require('./controllers/photos');

app.use(logger());

app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    if (401 == err.status) {
      this.status = 401;
      this.set('WWW-Authenticate', 'Basic');
      this.body = 'cant haz that';
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
