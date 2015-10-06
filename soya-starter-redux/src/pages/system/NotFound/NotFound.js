import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import React from 'react';

// Pages can have its own separate components.
import NotFoundReactComponent from './NotFoundReactComponent.js';

// We can also import using ES6 style.
import '../../../shared/sitewide.css';

export default class NotFound extends Page {
  render(httpRequest, routeArgs, callback) {
    var renderResult = new RenderResult();
    renderResult.head = '<title>Oops, not found!</title>';
    renderResult.body = React.createElement(NotFoundReactComponent, {});
    renderResult.setStatusCode(404);
    callback(renderResult);
  }
}