import React from 'react';
import Form from 'soya/lib/data/redux/form/Form';

import style from './style.css';
import { required, minSelected, requiredCheckbox, optional } from '../../../validator/general.js';
import { name, phone, maxLength } from '../../../validator/string.js';
import TextField from '../../common/TextField/TextField';
import NameField from '../../common/TextField/NameField';
import TextAreaField from '../../common/TextAreaField/TextAreaField';
import SelectBoxField from '../../common/SelectBoxField/SelectBoxField';
import SelectMultipleField from '../../common/SelectMultipleField/SelectMultipleField';
import RadioButtonsField from '../../common/RadioButtonsField/RadioButtonsField';
import CheckBoxesField from '../../common/CheckBoxesField/CheckBoxesField';

const TYPE = [
  { value: 'greetings', label: 'Say Hi' },
  { value: 'borrowing', label: 'Borrowing Money' },
  { value: 'bugreport', label: 'Bug Report' }
];

const RELATIONSHIP = [
  { value: 'friend', label: 'Friend' },
  { value: 'girlfriend', label: 'Girlfriend' },
  { value: 'acquaintance', label: 'Acquaintance' }
];

const TARGET = [
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'E-mail' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'slack', label: 'Slack' }
];

const CALL = [
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' }
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
      <NameField form={this._form} name="name" label="Your Name"
                 changeValidators={[required]}
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <TextField form={this._form} name="nickname" label="Nick Name"
                 changeValidators={[optional, name, maxLength.bind(null, 5)]}
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <TextField form={this._form} name="phoneNumber" label="Phone Number"
                 changeValidators={[required, phone]}
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <SelectBoxField form={this._form} name="type" label="Subject" options={TYPE}
                      changeValidators={[required]}
                      reduxStore={this.props.reduxStore} config={this.props.config} />
      <RadioButtonsField form={this._form} name="relationship"
                         changeValidators={[required, this.validateRelationship]}
                         label="Relationship" options={RELATIONSHIP}
                         reduxStore={this.props.reduxStore} config={this.props.config} />
      <CheckBoxesField form={this._form} name="target" label="Target"
                       options={TARGET} changeValidators={[requiredCheckbox]}
                       reduxStore={this.props.reduxStore} config={this.props.config} />
      <SelectMultipleField form={this._form} name="call" label="Available for call"
                           options={CALL} changeValidators={[minSelected.bind(null, 2)]}
                           reduxStore={this.props.reduxStore} config={this.props.config} />
      <TextAreaField form={this._form} name="message" label="Your Message"
                     changeValidators={[required]}
                     reduxStore={this.props.reduxStore} config={this.props.config} />
      <button onClick={this._form.submit.bind(this._form)}>Submit</button>
    </div>;
  }

  validateRelationship(value) {
    return value == 'girlfriend' ? 'Bullshit, I don\'t have a girlfriend (yet).' : true;
  }

  handleSubmit() {
    console.log('asdf');
  }
}