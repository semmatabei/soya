import React from 'react';
import Form from 'soya/lib/data/redux/form/Form';

import style from './style.css';
import TextField from '../../common/TextField/TextField';
import NameField from '../../common/TextField/NameField';
import TextAreaField from '../../common/TextAreaField/TextAreaField';
import SelectBoxField from '../../common/SelectBoxField/SelectBoxField';

const OPTIONS = [
  { value: 'greetings', label: 'Say Hi' },
  { value: 'borrowing', label: 'Borrowing Money' },
  { value: 'bugreport', label: 'Bug Report' }
];

export default class ContactForm extends React.Component {
  componentWillMount() {
    this._form = new Form(
      this.props.reduxStore,
      this.props.formId,
      this.handleSubmit.bind(this)
    );
  }

  render() {
    return <div className={style.form}>
      <h3>{this.props.formName}</h3>
      <NameField form={this._form} name="name" reduxStore={this.props.reduxStore} config={this.props.config} label="Your Name" />
      <TextField form={this._form} name="phoneNumber" reduxStore={this.props.reduxStore} config={this.props.config} label="Phone Number" />
      <SelectBoxField form={this._form} name="type" reduxStore={this.props.reduxStore} config={this.props.config} label="Subject" options={OPTIONS} />
      <TextAreaField form={this._form} name="message" reduxStore={this.props.reduxStore} config={this.props.config} label="Your Message" />
      <button onClick={this._form.submit.bind(this._form)}>Submit</button>
    </div>;
  }

  handleSubmit() {
    console.log('asdf');
  }
}