import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

class Component extends React.Component {
  render() {
    return <div>
      <DebugPanel top right bottom>
        <DevTools store={this.props.store} monitor={LogMonitor} />
      </DebugPanel>
    </div>;
  }
}

export default class TestStore extends Page {
  render(httpRequest, routeArgs, callback) {

  }
}