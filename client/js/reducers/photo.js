import { ActionTypes } from '../constants';
import assign from 'object-assign';

const initialState = {
  photos: [],
  uploading: false,
  requestSuceeded: false
}

export default function update(state = initialState, action) {
  if (action.type === ActionTypes.FETCH_PHOTOS) {
    return assign({}, state, {
      photos: state.photos.concat(action.photos)
    });
  }
  if (action.type === ActionTypes.POST_PHOTO) {
    return assign({}, state, {
      uploading: true
    });
  }
  if (action.type === ActionTypes.SUCCESS_POSTING_PHOTO) {
    return assign({}, state, {
      uploading: false,
      requestSuceeded: true
    });
  }
  if (action.type === ActionTypes.FAIL_POSTING_PHOTO) {
    return assign({}, state, {
      uploading: false,
      requestSuceeded: false
    });
  }
  return state
}
