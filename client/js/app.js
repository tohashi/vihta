import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import thunk from 'redux-thunk';
import * as reducers from './reducers'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import BaseLayout from './components/base_layout';
import Home from './components/home';
import PhotoList from './components/photo_list';

injectTapEventPlugin();

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  }),
  applyMiddleware(thunk)
)

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={BaseLayout}>
          <IndexRoute component={Home} />
          <Route path="list" component={PhotoList} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>
), document.getElementById('root'));

