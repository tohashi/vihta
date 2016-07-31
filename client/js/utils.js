const ENV  = require('../../env.js');

function getPhotoUrl(photo, type = 'thumbnail') {
  return 'https://s3-ap-northeast-1.amazonaws.com/' +
    `${ENV.BUCKET_NAME}/images/${type}/${photo.filename}`;
}

export {
  getPhotoUrl
}
