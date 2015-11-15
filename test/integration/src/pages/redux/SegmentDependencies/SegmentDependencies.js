import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer.js';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore.js';
import RandomTimeEchoString from '../../../components/contextual/RandomTimeEchoString/RandomTimeEchoString.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// TODO: Figure out how to do promise polyfill.
//import { polyfill } from 'es6-promise';

import style from '../../../shared/sitewide.css';

class Component extends React.Component {
  componentWillMount() {
    this.props.reduxStore.registerDataComponent(RandomTimeEchoString);
    this.setState({
      serialClientComponent: null,
      parallelClientComponent: null
    });
  }

  render() {
    return <div>
      <h1>Segment Dependencies</h1>
      <h3>Serial Dependencies</h3>
      <ul>
        <li><a href="javascript:void(0)" onClick={this.addSerialDependencyComponent.bind(this)}>Click this link</a> to send the string 'fetch-serial' to random time echo API, serially.</li>
        <li>The result printed below should be exact string 'fetch-serial', and network requests should be serial.</li>
      </ul>
      {this.state.serialClientComponent}
      <h3>Parallel Dependencies</h3>
      <ul>
        <li><a href="javascript:void(0)" onClick={this.addParallelDependencyComponent.bind(this)}>Click this link</a> to send the string 'fetch-parallel' to random time echo API, in parallel.</li>
        <li>The result printed below should be an anagram of 'fetch-parallel' (because of random time response), and network requests should be parallel.</li>
      </ul>
      {this.state.parallelClientComponent}
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>;
  }

  addSerialDependencyComponent() {
    var component = <RandomTimeEchoString reduxStore={this.props.reduxStore}
      config={this.props.config} loadAtClient={true} value={'fetch-serial'} />;
    this.setState({
      serialClientComponent: component
    });
  }

  addParallelDependencyComponent() {
    var component = <RandomTimeEchoString reduxStore={this.props.reduxStore}
      config={this.props.config} loadAtClient={true} value={'fetch-parallel'} isParallel={true} />;
    this.setState({
      parallelClientComponent: component
    });
  }
}

class SegmentDependencies extends Page {
  static get pageName() {
    return 'SegmentDependencies';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Segment Dependencies Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(SegmentDependencies);
export default SegmentDependencies;