import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import style from './style.css';

export class SelectMultipleInput extends React.Component {
  static connectId() {
    return 'SelectMultipleField';
  }

  render() {
    var i, value, options = [];
    for (i = 0; i < this.props.options.length; i++) {
      value = this.props.options[i].value;
      options.push(<option key={value} ref={value} value={value}>{this.props.options[i].label}</option>);
    }

    value = this.props.value == null ? [] : this.props.value;
    return <div className={style.selectMultipleBox}>
      <label>{this.props.label}</label>
      <select multiple value={value} onChange={this.handleChange.bind(this)}>
        {options}
      </select>
      {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
    </div>;
  }

  handleChange(event) {
    var i, value = [], options = event.target.getElementsByTagName('option');
    for (i = 0; i < options.length; i++) {
      if (options[i].selected) value.push(options[i].value);
    }
    this.props.handleChange(value);
  }
}

export default createField(SelectMultipleInput);