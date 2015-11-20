import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer.js';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

class Component extends React.Component {
  render() {
    return <div>
      <h1>SegmentCookie</h1>
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }
}

class SegmentCookie extends Page {
  static get pageName() {
    return 'SegmentCookie';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Segment With Cookie Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(SegmentCookie);
export default SegmentCookie;