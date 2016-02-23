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
      <textarea value={value} onChange={(event) => this.props.handleChange(event.target.value, event)} />
    </div>;
  }
}

export default createField(TextAreaInput);