import React from 'react';
import {prop} from 'soya/lib/helper';

// We can use webpack's localized CSS to ensure there is no naming clash
// between our components.
var style = require('./PhotoCaption.css');

export default class PhotoCaption extends React.Component {
  render() {
    return <div className={style.container}>
      <div className={style.image} style={{width: (this.props.width + 22) + 'px'}}>
        <img src={this.props.url} />
        <span className={style.imageCaption}>{this.props.caption}</span>
      </div>
    </div>;
  }
}