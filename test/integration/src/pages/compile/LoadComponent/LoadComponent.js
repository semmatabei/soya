import register from 'soya/lib/client/Register';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';
import Page from 'soya/lib/page/Page';
import React from 'react';


// Import the reusable component.
import PhotoCaption from '../../../components/common/PhotoCaption/PhotoCaption.js';

// Load sitewide, shared resource.
require('../../../shared/sitewide.css');

// Get image that belong only to this page.
var url = require('./mountains.jpg');

class Component extends React.Component {
  render() {
    return <div>
      <h1>Another Page</h1>
      <p>This is another page, reusing the same React component without needing to know its dependencies:</p>
      <PhotoCaption url={url} caption={"Photo by Brandon Lam"} width={300} />
    </div>;
  }
}

class LoadComponent extends Page {
  static get pageName() {
    return 'LoadComponent';
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Load Component</title>';
    reactRenderer.body = React.createElement(Component, {router: this.router});
    var renderResult = new RenderResult(reactRenderer);
    renderResult.httpHeaders.set('X-Foo', 'soya-ftw');
    callback(renderResult);
  }
}

register(LoadComponent);
export default LoadComponent;