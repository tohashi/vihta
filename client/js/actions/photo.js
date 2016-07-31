import { ActionTypes } from '../constants';
import qs from 'querystring';

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  const error = new Error(res.statusText);
  error.response = res;
  throw error;
}

function parseJSON(res) {
  return res.json()
}

export function fetchPhotos(params) {
  return (dispatch) => {
    fetch('/photos?' + qs.stringify(params))
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: ActionTypes.FETCH_PHOTOS,
        photos: data
      })
    })
    .catch((err) => {
      console.log('request failed', err)
      dispatch({
        type: ActionTypes.FAIL_FETCHING_PHOTOS,
        err
      })
    });
  };
}

export function postPhoto(params) {
  return (dispatch) => {
    const data = new FormData()
    data.append('file', params.file);
    data.append('author', params.author);

    dispatch({
      type: ActionTypes.POST_PHOTO
    });

    return fetch('/photos', {
      method: 'POST',
      body: data
    })
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      dispatch({
        type: ActionTypes.SUCCESS_POSTING_PHOTO
      })
    })
    .catch((err) => {
      // TODO
      console.log('request failed', err)
    });
  };
}

export function removePhoto(params) {
  return (dispatch) => {
    fetch('/photos?' + qs.stringify(params), {
      method: 'DELETE'
    })
  };
}
