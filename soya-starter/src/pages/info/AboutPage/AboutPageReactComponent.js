/* @flow */

import {prop} from 'soya/lib/helper';
import MainSearchBox from '../../../components/tvlk/MainSearchBox/MainSearchBox';
import React from 'react';

var path = require('path');
var style = prop(require('./AboutPage.css'), 'locals');
var scramblerLink = require('./scrambler.jpg');

export default React.createClass({
  init: function() {

  },
  render: function() {
    return <div>
      <h1 className={style.AboutPage}>Hello World!</h1>
      <p>Sample text <a onClick={this.handleClick}>Try and click me!</a></p>
      <div className={style.AboutPageDiv}></div>
      <img src={scramblerLink}/>
    </div>;
  },
  handleClick: function() {
    alert('hahahaha');
  }
});
