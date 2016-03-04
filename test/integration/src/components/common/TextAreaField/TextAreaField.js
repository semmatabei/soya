import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import style from './style.css';

export class TextAreaInput extends React.Component {
  static connectId() {
    return 'TextAreaField';
  }

  render() {
    var value = this.props.value ? this.props.value : '';
    return <div className={style.textAreaInput}>
      <label>{this.props.label}</label>
      <textarea value={value} disabled={this.props.isDisabled}
                onChange={(event) => this.props.handleChange(event.target.value, event)} />
      {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
    </div>;
  }
}

export default createField(TextAreaInput);