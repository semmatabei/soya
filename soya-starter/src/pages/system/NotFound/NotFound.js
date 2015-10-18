import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';
import React from 'react';

// Pages can have its own separate components.
import NotFoundReactComponent from './NotFoundReactComponent.js';

// We can also import using ES6 style.
import '../../../shared/sitewide.css';

export default class NotFound extends Page {
  render(httpRequest, routeArgs, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Oops, not found!</title>';
    reactRenderer.body = React.createElement(NotFoundReactComponent, {});
    var renderResult = new RenderResult(reactRenderer);
    renderResult.setStatusCode(404);
    callback(renderResult);
  }
}