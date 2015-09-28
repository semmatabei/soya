import RenderResult from 'soya/lib/page/RenderResult';
import React from 'react';

import NotFoundReactComponent from './NotFoundReactComponent.js';
import style from '../../../shared/sitewide.css';

export default class NotFound {
  _config;

  constructor(config) {
    this._config = config;
  }

  render(httpRequest, routeArgs, callback) {
    var renderResult = new RenderResult();
    renderResult.head = '<title>Oops, not found!</title>';
    renderResult.body = React.createElement(NotFoundReactComponent, {});
    renderResult.setStatusCode(404);
    callback(renderResult);
  }
}