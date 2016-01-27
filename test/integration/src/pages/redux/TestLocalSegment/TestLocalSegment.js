import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer.js';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import ModalSegment from '../../../segments/ModalSegment.js';
import ModalLayer from '../../../components/contextual/ModalLayer/ModalLayer.js';
import ConfirmModal from '../../../components/common/ConfirmModal/ConfirmModal.js';

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

class Component extends React.Component {
  componentWillMount() {
    this.modalActions = this.props.reduxStore.register(ModalSegment);
  }

  render() {
    return <div>
      <h1>Local Segment</h1>
      <h3>Modal Window</h3>
      <ul>
        <li>Default value for modal window segment.</li>
        <li><code>&lt;ModalLayer&gt;</code> component listens to the local segment and re-renders appropriately.</li>
        <li><a href={'javascript:void(0)'} onClick={this.addConfirmModal.bind(this)}>Click this</a> to add a confirmation modal window to the redux state.</li>
      </ul>
      <ModalLayer reduxStore={this.props.reduxStore} config={this.props.config}>
        <ConfirmModal/>
      </ModalLayer>
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }

  addConfirmModal() {
    var addModalAction = this.modalActions.add(ConfirmModal.modalType, 'handsome', {
      text: 'Are you handsome?'
    });
    this.props.reduxStore.dispatch(addModalAction);
  }
}

class TestLocalSegment extends Page {
  static get pageName() {
    return 'TestLocalSegment';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Local Segment Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(TestLocalSegment);
export default TestLocalSegment;