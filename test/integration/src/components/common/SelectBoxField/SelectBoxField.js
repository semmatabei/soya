import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import style from './style.css';

export class SelectBoxInput extends React.Component {
  static connectId() {
    return 'SelectBoxField';
  }

  componentWillMount() {
    // First option always automatically picked in a select box.
    this.props.handleChange(this.props.options[0].value);
  }

  render() {
    var i, value, options = [];
    for (i = 0; i < this.props.options.length; i++) {
      value = this.props.options[i].value;
      options.push(<option key={value} value={value}>{this.props.options[i].label}</option>);
    }

    return <div>
      <label>{this.props.label}</label>
      <select value={this.props.value} onChange={(event) => this.props.handleChange(event.target.value, event)}>
        {options}
      </select>
    </div>;
  }
}

export default createField(SelectBoxInput);