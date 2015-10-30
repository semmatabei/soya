import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer.js';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore.js';
import UserProfile from '../../../components/contextual/UserProfile/UserProfile.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// TODO: Figure out how to do promise polyfill.
import { Promise } from 'es6-promise';

import style from '../../../shared/sitewide.css';

class Component extends React.Component {
  componentWillMount() {
    this.setState({
      serverUsername: 'rickchristie',
      clientUsername: 'captainjack'
    });
  }

  render() {
    return <div>
      <h1>Server-Side Hydration</h1>
      <h2>Specs</h2>
      <ul>
        <li>HTML sent by server must already include user profile data.</li>
        <li>Server rendering is blocked for 5 seconds while fetching user data.</li>
        <li>Initial state from server gets passed to Soya client runtime.</li>
        <li>React client side rendering works without inconsistencies in generated markup.</li>
        <li>UI handlers assigned appropriately. <a href="javascript:void(0)" onClick={this.handleClick}>This link handler</a> must still work.</li>
        <li>Client side re-rendering is triggered when this link is clicked: <a href="javascript:void(0)" onClick={this.loadAnotherUser.bind(this)}>load another profile.</a></li>
      </ul>
      <h2>Server Hydrated User Profile Badge:</h2>
      <UserProfile reduxStore={this.props.reduxStore} username={this.state.serverUsername}></UserProfile>
      <h1>Client-Side Hydration</h1>
      <h2>Specs</h2>
      <ul>
        <li>HTML sent by server doesn't include this user's profile data.</li>
        <li>This user's data is loaded asynchronously with AJAX.</li>
        <li>Upon waiting for the data to load, a loading state is returned by the component.</li>
      </ul>
      <h2>Client Hydrated User Profile Badge:</h2>
      <UserProfile reduxStore={this.props.reduxStore} username={this.state.clientUsername} loadAtClient={true}></UserProfile>
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }

  loadAnotherUser() {
    this.setState({
      serverUsername: 'meesa'
    });
  }

  handleClick() {
    alert('It works!');
  }
}

class Hydration extends Page {
  static get pageName() {
    return 'Hydration';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Hydration Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(Hydration);
export default Hydration;