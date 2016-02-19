import React from 'react';

import style from './style.css';

export default class TextInput extends React.Component {
  render() {
    return <div className={style.textInput}>
      <label>{this.props.label}</label>
      <input type="text" value={this.props.value} onChange={(event) => this.props.handleChange(event.target.value, event)} />
    </div>;
  }
}