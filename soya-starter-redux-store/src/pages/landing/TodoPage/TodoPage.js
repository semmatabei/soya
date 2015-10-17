import React from 'react';
import Cookie from 'soya/lib/page/Cookie';
import {prop} from 'soya/lib/helper';
import {Provider} from 'react-redux';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from './App.js';
import todos from '../../../store/todos.js';

require('./TodoPage.css');

class Component extends React.Component {
  render() {
    return <div className="todoapp">
      <Provider store={this.props.store}>
        <App />
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={this.props.store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }
}

export default class HomePage extends Page {
  render(httpRequest, routeArgs, callback) {
    var store = todos();
    var renderResult = new RenderResult();
    renderResult.head = '<title>Hello World!</title>';
    renderResult.component = Component;
    renderResult.body = React.createElement(Component, {router: this.router, store: store});
    callback(renderResult);
  }
}