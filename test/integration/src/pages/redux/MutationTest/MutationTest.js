import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer.js';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore.js';
import UserProfile from '../../../components/contextual/UserProfile/UserProfile.js';
import IncrementUserPostMutation from '../../../mutation/IncrementUserPostMutation.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

const USERNAME = 'rickchristie';

class Component extends React.Component {
  render() {
    return <div>
      <h1>Mutation Test</h1>
      <ul>
        <li>When you <a href="javascript:void(0)" onClick={this.execMutation.bind(this, USERNAME)}>click this link</a>, the increment post mutation for <code>{USERNAME}</code> will be executed.</li>
        <li>When mutation is successful, the user profile data should be automatically refetched by <code>ReduxStore</code>.</li>
        <li>When you click this link, increment all posts mutation will be executed, and all user profiles should refresh.</li>
        <li>When you click this link, it toggles badge names so not only <code>BadgeSegment</code> should change, but also <code>UserSegment</code>.</li>
      </ul>
      <h3>Username: {USERNAME}</h3>
      <UserProfile reduxStore={this.props.reduxStore} config={this.props.config} username={USERNAME}></UserProfile>
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }

  execMutation(username) {
    var mutation = new IncrementUserPostMutation(username);
    this.props.reduxStore.execute(mutation);
  }
}

class MutationTest extends Page {
  static get pageName() {
    return 'MutationTest';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Mutation Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(MutationTest);
export default MutationTest;