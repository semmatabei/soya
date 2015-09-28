/* @flow */

import AboutPageReactComponent from './AboutPageReactComponent';
import RenderResult from 'soya/lib/page/RenderResult';

var React = require('react');

export default class AboutPage {
  config;
  router;

  constructor(config, router) {
    this.config = config;
    this.router = router;
  }

  render(httpRequest, routeArgs, callback) {
    var renderResult = new RenderResult();
    renderResult.head = '<meta name="description" content="blah" /><title>About Page</title>';
    renderResult.body = React.createElement(AboutPageReactComponent, {
      assetHostPath: this.config.assetHostPath,
      routeArgs: routeArgs,
      httpRequest: httpRequest
    });
    renderResult.httpHeaders.set('X-Foo', 'soya-ftw');
    callback(renderResult);
  }
}
