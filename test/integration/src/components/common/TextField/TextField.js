import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import loadingGif from '../../../shared/loading.gif';
import style from './style.mod.css';

export class TextInput extends React.Component {
  static connectId() {
    return 'TextField';
  }

  componentWillMount() {
    this.prevValidatedValue = null;
  }

  render() {
    return <div className={style.textInput}>
      <label>{this.props.label}</label>
      <input type="text" value={this.props.value}
             disabled={this.props.isDisabled}
             onChange={this.handleChange.bind(this)}
             onBlur={this.handleBlur.bind(this)} />
      {this.props.isValidating ? <img src={loadingGif} /> : null}
      {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
    </div>;
  }

  handleChange(event) {
    // Always run async validation if value is changed at least once.
    this.prevValidatedValue = null;
    this.props.handleChange(event.target.value, event);
  }

  handleBlur(event) {
    if (this.prevValidatedValue !== this.props.value) {
      this.prevValidatedValue = this.props.value;
      this.props.handleAsyncValidation(this.props.value, event);
    }
  }
}

export default createField(TextInput);