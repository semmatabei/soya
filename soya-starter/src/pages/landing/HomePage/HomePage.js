import React from 'react';
import Cookie from 'soya/lib/page/Cookie';
import {prop} from 'soya/lib/helper';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';

// Using webpack, we can load images and CSS by requiring it.
var url = require('./miyuki.png');
require('../../../shared/sitewide.css');

// We can use webpack's localized CSS to ensure there is no naming clash
// between our modules.
var style = prop(require('./HomePage.css'));

class Component extends React.Component {
  render() {
    return <div>
      <h1>Hello world!</h1>
      <p>Greetings from Soya! Here's an image, loaded using webpack:</p>
      <div className={style.image}>
        <img src={url} />
        <span className={style.imageCaption}>
          Miyuki by <a href="http://nio-nyan.deviantart.com/art/Render-Shiba-Miyuki-478659540">Nio-Nyan</a>.<br/>
          Requested by Asendia.
        </span>
      </div>
      <p style={{clear: 'both', padding: '15px 0 0 0'}}>
        Apologies for the flash of unstyled content. It's an issue we are
        currently still working on.
      </p>
      <p>
        All this is rendered server-side. You can view the source to see the generated HTML. Since we use <code>React.renderToString()</code>, <a href="javascript:void(0)" onClick={this.handleClick}>bound events</a> will still work.
      </p>
      <p>
        Here's <a href={this.props.router.reverseRoute('ABOUT_PAGE')}>another page</a>, link generated using soya's built-in Router.
      </p>
    </div>;
  }

  handleClick() {
    alert('React is awesome!');
  }
}

export default class HomePage extends Page {
  render(httpRequest, routeArgs, callback) {
    var renderResult = new RenderResult();
    renderResult.head = '<title>Hello World!</title>';
    renderResult.body = React.createElement(Component, {router: this.router});
    callback(renderResult);
  }
}