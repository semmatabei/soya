import React from 'react';
import Cookie from 'soya/lib/page/Cookie';

import RenderResult from 'soya/lib/page/RenderResult';
import HomePageReactElement from './HomePageReactElement';

export default class HomePage {
  config;

  constructor(config) {
    this.config = config;
  }

  render(httpRequest, routeArgs, callback) {
    var renderResult = new RenderResult();
    renderResult.head = '';
    renderResult.body = React.createElement(HomePageReactElement, {});
    renderResult.setCookie(Cookie.createSession('foo', 'bar'));
    callback(renderResult);
  }
}