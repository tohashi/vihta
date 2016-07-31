import React from 'react';
import 'whatwg-fetch';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

const FINAL_STEP_INDEX = 2;

export default class UploadStepper extends React.Component {
  state = {
    file: null,
    author: '',
    finished: false,
    stepIndex: 0,
    guideModalIsOpen: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.uploading &&
        !nextProps.uploading &&
        nextProps.requestSuceeded) {
      this.setState({ stepIndex: 0 });
    } else if (nextProps.imageSrc) {
      this.setState({ stepIndex: 1 });
    }
  }

  componentDidUpdate() {
    if (this.state.stepIndex !== 1) {
      this.props.clearFileImageSrc();
    }
  }

  handleChangeAuthor(e) {
    this.setState({
      author: e.target.value
    });
  }

  handleChangeStep(stepIndex) {
    const nextStepIndex = Math.max(Math.min(stepIndex, FINAL_STEP_INDEX), 0);
    this.setState({
      stepIndex: nextStepIndex,
      finished: nextStepIndex >= FINAL_STEP_INDEX
    });
  }

  setFile(e) {
    const file = e.target.files[0] || null;
    // TODO filetype check
    this.setState({ file });
    this.props.getFileImageSrc(file);
  }

  triggerFileUpload() {
    this.refs.fileInput.click();
  }

  postFile() {
    if (!this.state.file) {
      return;
    }
    this.props.postPhoto({
      file: this.state.file,
      author: this.state.author
    });
  }

  renderPostActions() {
    if (this.props.uploading) {
      return (
        <CircularProgress style={{ display: 'block' }} />
      );
    }
    const style = {
      margin: '12px 4px 8px 0'
    };
    return (
      <div>
        <RaisedButton
          label="投稿する"
          primary
          onTouchTap={this.postFile.bind(this)}
          style={style}
        />
        <FlatButton
          label="選び直す"
          disableTouchRipple={true}
          disableFocusRipple={true}
          onTouchTap={this.handleChangeStep.bind(this, 0)}
          style={style}
        />
      </div>
    );
  }

  openGuideModal(e) {
    e.preventDefault();
    this.setState({ guideModalIsOpen: true });
  }

  closeGuideModal() {
    this.setState({ guideModalIsOpen: false });
  }

  render() {
    return (
      <div>
        <Stepper activeStep={this.state.stepIndex} orientation="vertical" style={{ marginBottom: '48px' }}>
          <Step>
            <StepLabel>写真を選んでください</StepLabel>
            <StepContent>
              <RaisedButton
                label="写真を撮る/選ぶ"
                primary
                style={this.props.buttonStyle}
                onTouchTap={this.triggerFileUpload.bind(this)}
              />
              <input
                ref="fileInput"
                type="file"
                name="file"
                multiple
                style={{ display: 'none' }}
                onChange={this.setFile.bind(this)}
              />
              <a href="#" onClick={this.openGuideModal.bind(this)}>開けない時は</a>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>写真を確認して「投稿する」ボタンを押してください</StepLabel>
            <StepContent>
              <Paper
                style={{
                  maxWidth: '496px',
                  margin: '8px',
                  padding: '8px'
                }}
                zDepth={2}
                rounded={false} 
              >
                <img
                  src={this.props.imageSrc}
                  style={{
                    width: '100%',
                    maxWidth: '480px'
                  }}
                />
              </Paper>
              <TextField
                name="author"
                floatingLabelText="撮影者名（任意）"
                floatingLabelFixed={true}
                hintText={'author'}
                value={this.state.author}
                onChange={this.handleChangeAuthor.bind(this)}
                style={{ display: 'block' }}
              />

              {this.renderPostActions()}
            </StepContent>
          </Step>
        </Stepper>

        <Dialog
          titleStyle={{ display: 'none' }}
          actions={
            <FlatButton
              label="閉じる"
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.closeGuideModal.bind(this)}
            />
          }
          modal={false}
          open={this.state.guideModalIsOpen}
          onRequestClose={this.closeGuideModal.bind(this)}
        >
          <p>
            iOSの方 -> Safariで開く<br />
            Androidの方 -> Chromeで開く<br />
            をお試しください。
          </p>
        </Dialog>

      </div>
    );
  }
}
