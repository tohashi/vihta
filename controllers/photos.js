'use strict';

const ENV  = require('../env.js');
const path = require('path');
const parse = require('co-busboy');
const monk = require('monk');
const db = monk(ENV.MONGODB_URI);
const Pass = require('stream').PassThrough;
const gm = require('gm').subClass({ imageMagick: true });
const AWS = require('aws-sdk');
const convert = require('koa-convert');

const photos = db.get('photos');

AWS.config.region = 'ap-northeast-1';
AWS.config.update({
  accessKeyId: ENV.AWS_ACCESS_KEY_ID,
  secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  region: 'ap-northeast-1'
});
const s3bucket = new AWS.S3();
const bucketName = ENV.BUCKET_NAME;
const dirs = {
  origin: 'images/origin',
  thumbnail: 'images/thumbnail'
};
const allowedExtensions = [
  '.jpg', '.jpeg', '.gif', '.png',
  '.JPG', '.JPEG', '.GIF', '.PNG'
];

async function index(ctx, next) {
  if (ctx.method !== 'GET') {
    return await next();
  }
  const query = Object.assign({
    skip: null,
    limit: null 
  }, ctx.request.query);

  ctx.body = await photos.find({}, {
    skip: parseInt(query.skip),
    limit: parseInt(query.limit),
    sort: { timestamp: -1 }
  });
}

// TODO replace co-busboy
function *create(next) {
  if (this.method !== 'POST') {
    return yield next;
  }
  const parts = parse(this, {
    checkFile: function (fieldname, file, filename) {
      if (allowedExtensions.indexOf(path.extname(filename)) === -1) {
        let err = new Error('invalid jpg image')
        err.status = 400
        return err
      }
    }
  });

  const data = {};
  const dataKeys = [ 'author' ];
  let part;

  while (part = yield parts) {
    if (part.length && dataKeys.indexOf(part[0]) > -1) {
      data[part[0]] = part[1];
      continue;
    } else if (!part.filename) {
      continue;
    }

    const timestamp = data.timestamp = Date.now();
    const filename = data.filename =
      path.parse(part.filename).name + timestamp + path.extname(part.filename);
    let originStream = new Pass();
    let thumbnailStream = new Pass();
    part.pipe(originStream);
    part.pipe(thumbnailStream);

    originStream = gm(originStream)
      .autoOrient()
      .quality(80)
      .stream();
    thumbnailStream = gm(thumbnailStream)
      .resize('320')
      .autoOrient()
      .borderColor('#ffffff')
      .border(8, 8)
      .quality(85)
      .stream();

    const baseParams = {
      Bucket: bucketName,
      ContentType: part.mime
    };

    yield uploadToS3(Object.assign({}, baseParams, {
      Key: `${dirs.origin}/${filename}`,
      Body: originStream
    }));
    yield uploadToS3(Object.assign({}, baseParams, {
      Key: `${dirs.thumbnail}/${filename}`,
      Body: thumbnailStream
    }));
  }
  yield photos.insert(data);

  this.body = data;
}

async function destroy(ctx, next) {
  if (ctx.method !== 'DELETE') {
    return await next();
  }
  await photos.remove({ _id: ctx.request.query.id });
  ctx.body = {};
}

function uploadToS3(params) {
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

module.exports = {
  index,
  create: convert(create),
  destroy
};
