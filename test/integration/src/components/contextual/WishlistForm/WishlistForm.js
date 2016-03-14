import React from 'react';

import style from './style.css';

import TextField from '../../common/TextField/TextField';

export default class WishlistForm extends React.Component {
  render() {
    return <div className={style.form}>
      <h3>{this.props.formName}</h3>
      <TextField form={this.props.form} name={['life', 'material']} label="Material"
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <button onClick={this.handleSubmit.bind(this)}>Submit</button>
    </div>;
  }

  submit(result) {
    console.log('VALIDATION RESULT', result);
  }

  handleSubmit() {
    this.props.form.submit(
      this.submit.bind(this)
    );
  }
}