import React from 'react';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import BottomNav from './bottom_nav';

export default class BaseLayout extends React.Component {
  state = {
    drawerIsOpen: false
  };

  handleToggleDrawer() {

    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    });
  }

  handleClose() {
    this.setState({
      drawerIsOpen: false
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Wedding Photos"
          style={{ position: 'fixed' }}
          onLeftIconButtonTouchTap={this.handleToggleDrawer.bind(this)}
        />
        <div style={{
          paddingTop: '64px',
          paddingBottom: '48px',
          minHeight: '400px'
        }}>
          <div style={{
            margin: '32px'
          }}>
            {this.props.children}
          </div>
        </div>
        <Drawer
          docked={false}
          width={200}
          open={this.state.drawerIsOpen}
          onRequestChange={(drawerIsOpen) => this.setState({ drawerIsOpen })}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <MenuItem onTouchTap={this.handleClose.bind(this)}>
              写真を投稿する
            </MenuItem>
          </Link>
          <Link to="/list" style={{ textDecoration: 'none' }}>
            <MenuItem onTouchTap={this.handleClose.bind(this)}>
              写真を見る
            </MenuItem>
          </Link>
          <a href="/viewer" style={{ textDecoration: 'none' }}>
            <MenuItem onTouchTap={this.handleClose.bind(this)}>
              3D Viewer
            </MenuItem>
          </a>
        </Drawer>
        <BottomNav />
      </div>
    );
  }
}
