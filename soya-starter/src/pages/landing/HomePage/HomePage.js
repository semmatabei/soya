import React from 'react';
import Cookie from 'soya/lib/page/Cookie';
import {prop} from 'soya/lib/helper';
import Page from 'soya/lib/page/Page';
import register from 'soya/lib/client/Register.js';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';

// Import reusable component.
import PhotoCaption from '../../../components/common/PhotoCaption/PhotoCaption';

// Load sitewide, shared resource.
require('../../../shared/sitewide.css');

// Get image that belong only to this page.
var url = require('./landscape.jpg');

class Component extends React.Component {
  render() {
    return <div>
      <h1>Hello world!</h1>
      <p>Greetings from Soya! Here's a reusable react component, loaded using webpack:</p>
      <PhotoCaption url={url} caption={"Photo by Daniel Roe"} width={200} />
      <p>
        Apologies for the flash of unstyled content. It's an issue we are
        currently still working on.
      </p>
      <p>
        All this is rendered server-side. You can view the source to see the generated HTML.
        Since we use <code>React.renderToString()</code>, <a href="javascript:void(0)" onClick={this.handleClick}>bound events</a> will still work.
      </p>
      <p>
        Here's <a href={this.props.router.reverseRoute('ANOTHER_PAGE')}>another page</a>, link generated using soya's built-in reverse routing.
      </p>
    </div>;
  }

  handleClick() {
    alert('React is awesome!');
  }
}

class HomePage extends Page {
  static get pageName() {
    return 'HomePage';
  }

  static getRouteRequirements() {
    return ['ANOTHER_PAGE'];
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Hello World!</title>';
    reactRenderer.body = React.createElement(Component, {router: this.router});
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(HomePage);
export default HomePage;