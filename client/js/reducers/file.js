import { ActionTypes } from '../constants';

const initialState = {
  imageSrc: null
}

export default function update(state = initialState, action) {
  if (action.type === ActionTypes.GET_FILE_IMAGE_SRC) {
    return { imageSrc: action.imageSrc }
  }
  if (action.type === ActionTypes.CLEAR_FILE_IMAGE_SRC) {
    return { imageSrc: null }
  }
  return state
}
