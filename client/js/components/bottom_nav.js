import React from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import CameraIcon from 'material-ui/svg-icons/action/camera-enhance';
import ListIcon from 'material-ui/svg-icons/action/view-list';
import { browserHistory } from 'react-router';

export default class BottomNav extends React.Component {
  state = {
    selectedIndex: 0
  };

  componentDidMount() {
    browserHistory.listen((data) => {
      this.setState({
        selectedIndex: data.pathname === '/list' ? 1 : 0
      });
    });
  }

  render() {
    return (
      <Paper
        className="bottom-nav"
        zDepth={1}
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%'
        }}
      >
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="写真を投稿する"
            icon={<CameraIcon />}
            onTouchTap={() => browserHistory.push('/')}
          />
          <BottomNavigationItem
            label="写真を見る"
            icon={<ListIcon />}
            onTouchTap={() => browserHistory.push('/list')}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}
