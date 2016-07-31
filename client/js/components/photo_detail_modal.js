import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { getPhotoUrl } from '../utils';

export default class DialogExampleSimple extends React.Component {
  state = {
    removeButtonIsVisible: false
  };

  componentDidMount() {
    this.setState({
      removeButtonIsVisible: window.location.search === '?adminadmin=true'
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="閉じる"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.props.closeDetailModal}
      />,
    ];

    if (this.state.removeButtonIsVisible) {
      actions.push(
        <RaisedButton
          label="削除"
          style={{ marginLeft: '4px' }}
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.props.removePhoto.bind(this.props, this.props.photo._id)}
        />
      );
    }

    const title = this.props.photo.author ? `by ${this.props.photo.author}` : '';
    const titleStyle = title ? {} : { display: 'none' }
    const imageSrc = getPhotoUrl(this.props.photo, 'origin');

    return (
      <Dialog
        title={this.props.photo.author ? `by ${this.props.photo.author}` : ''}
        titleStyle={titleStyle}
        contentStyle={{
          width: '95%'
        }}
        bodyStyle={{
          padding: '12px'
        }}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.closeDetailModal}
        autoScrollBodyContent={true}
      >
        {/* TODO loader */}
        <a href={imageSrc} download>
          <img
            src={imageSrc}
            onLoad={this.forceUpdate.bind(this, (() => {}))}
            style={{ width: '100%' }}
          />
        </a>
      </Dialog>
    );
  }
}
