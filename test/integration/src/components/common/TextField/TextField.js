import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import style from './style.css';

export class TextInput extends React.Component {
  static connectId() {
    return 'TextField';
  }

  render() {
    return <div className={style.textInput}>
      <label>{this.props.label}</label>
      <input type="text" value={this.props.value}
             onChange={(event) => this.props.handleChange(event.target.value, event)}
             onBlur={(event) => this.props.handleAsyncValidation(event.target.value, event)} />
      {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
    </div>;
  }
}

export default createField(TextInput);