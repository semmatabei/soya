import RenderResult from 'soya/lib/page/RenderResult';
import Page from 'soya/lib/page/Page';
import React from 'react';

import AboutPageReactComponent from './AboutPageReactComponent';
import style from '../../../shared/sitewide.css';

export default class AboutPage extends Page {
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