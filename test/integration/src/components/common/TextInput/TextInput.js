import React from 'react';

import style from './style.css';

export default class TextInput extends React.Component {
  componentWillMount() {
    this.setState({
      value: ''
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return <div className={style.textInput}>
      <label>{this.props.label}</label>
      <input type="text" value={this.state.value} onChange={this.handleChange.bind(this)} />
    </div>;
  }
}