import React from 'react';

var url = require('../../../shared/redirect.png');

export default React.createClass({
  handleClick: function() {
    alert('haha');
  },
  render: function() {
    return <div><h1>Hello world!</h1>
      <a onClick={this.handleClick}>Bego gua</a>
    <img src={url} /></div>;
  }
});