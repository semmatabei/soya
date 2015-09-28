/* @flow */

import FaqPageReactComponent from './FaqPageReactComponent';
import RenderResult from 'soya/lib/page/RenderResult';
import React from 'react';

require('./FaqPage.css');

export default class FaqPage {
  constructor() {

  }

  render(httpRequest, routeArgs, complete) {
    setTimeout(function() {
      throw new Error('Page not implemented yet!');
    }, 5000);
    var renderResult = new RenderResult();
    renderResult.body = React.createElement(React.createClass({
      render: function() {
        return <div><h1>FAQ</h1><p>{routeArgs.foo}</p></div>;
      }
    }));
    complete(renderResult);
  }
}