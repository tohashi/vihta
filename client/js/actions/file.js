import { ActionTypes } from '../constants';

export function getFileImageSrc(file) {
  return (dispatch) => {
    if (!file) {
      dispatch({
        type: ActionTypes.GET_FILE_IMAGE_SRC,
        imageSrc: null
      });
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      dispatch({
        type: ActionTypes.GET_FILE_IMAGE_SRC,
        imageSrc: fr.result
      });
    }
    fr.readAsDataURL(file);
  }
}

export function clearFileImageSrc() {
  return {
    type: ActionTypes.CLEAR_FILE_IMAGE_SRC
  };
}
