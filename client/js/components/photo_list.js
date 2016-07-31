import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux'
import { fetchPhotos, removePhoto } from '../actions/photo';
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import PhotoDetailModal from './photo_detail_modal';
import CircularProgress from 'material-ui/CircularProgress';
import { getPhotoUrl } from '../utils';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    overflowY: 'auto',
  },
};

const PHOTO_REQUEST_LIMIT = 50;

class PhotoList extends React.Component {
  state = {
    selectedPhoto: {},
    modalIsOpen: false,
    loading: true
  };

  scrollHandler = _.throttle(this.handleScroll.bind(this), 100);

  componentDidMount() {
    this.props.fetchPhotos({
      skip: this.props.photos.length,
      limit: PHOTO_REQUEST_LIMIT
    });

    window.addEventListener('scroll', this.scrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false });
  }

  handleScroll() {
    if (this.state.loading ||
      document.body.scrollTop < 182 * (this.props.photos.length / 2 - 2) + 32) {
      return;
    }

    this.setState({
      loading: true
    }, () => {
      this.props.fetchPhotos({
        skip: this.props.photos.length,
        limit: PHOTO_REQUEST_LIMIT
      });
    });
  }

  openDetailModal(photo) {
    this.setState({
      selectedPhoto: photo,
      modalIsOpen: true
    });
  }

  closeDetailModal() {
    this.setState({
      selectedPhoto: {},
      modalIsOpen: false
    });
  }

  removePhoto(id) {
    this.props.removePhoto({ id });
    window.location.reload();
  }

  render(){
    return (
      <div>
        <div style={styles.root}>
          <GridList
            cellHeight={180}
            style={styles.gridList}
          >
            <Subheader></Subheader>
            {this.props.photos.map((photo, i) => (
              <GridTile
                className="photo-grid"
                key={photo._id}
                title=""
                subtitle={photo.author ? <span>by <b>{photo.author}</b></span> : <span />}
                onTouchTap={this.openDetailModal.bind(this, photo)}
                cols={i % 11 === 0 ? 2 : 1}
                rows={i % 11 === 0 ? 2 : 1}
                style={{ textAlign: 'center' }}
              >
                <img src={getPhotoUrl(photo)} />
              </GridTile>
            ))}
          </GridList>
          <PhotoDetailModal
            open={this.state.modalIsOpen}
            photo={this.state.selectedPhoto}
            closeDetailModal={this.closeDetailModal.bind(this)}
            removePhoto={this.removePhoto.bind(this)}
          />
        </div>
        {this.state.loading ? 
          <CircularProgress
            style={{
              display: 'block',
              margin: '0 auto'
            }}
          />
        : null}
      </div>
    );
  }
}

export default connect(
  state => ({ photos: state.photo.photos }),
  { fetchPhotos, removePhoto }
)(PhotoList)

