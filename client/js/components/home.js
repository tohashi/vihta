import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { getFileImageSrc, clearFileImageSrc } from '../actions/file';
import { postPhoto } from '../actions/photo';
import UploadStepper from './upload_stepper';
import Snackbar from 'material-ui/Snackbar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const buttonStyle = {
  display: 'block',
  width: '200px',
  margin: '10px 0'
}

class Home extends React.Component {
  state = {
    snackbarIsOpen: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.uploading &&
        !nextProps.uploading &&
        nextProps.requestSuceeded) {
      this.setState({ snackbarIsOpen: true });
    }
  }

  handleCloseSnackBar() {
    this.setState({ snackbarIsOpen: false });
  }

  render() {
    return (
      <div>
        <UploadStepper
          buttonStyle={buttonStyle}
          imageSrc={this.props.imageSrc}
          uploading={this.props.uploading}
          requestSuceeded={this.props.requestSuceeded}
          getFileImageSrc={this.props.getFileImageSrc}
          postPhoto={this.props.postPhoto}
          clearFileImageSrc={this.props.clearFileImageSrc}
        />

        <Snackbar
          open={this.state.snackbarIsOpen}
          message="投稿しました"
          autoHideDuration={4000}
          onRequestClose={this.handleCloseSnackBar.bind(this)}
         />
      </div>
    );
  }
}

export default connect(
  state => ({
    imageSrc: state.file.imageSrc,
    uploading: state.photo.uploading,
    requestSuceeded: state.photo.requestSuceeded
  }),
  { getFileImageSrc, clearFileImageSrc, postPhoto }
)(Home)

