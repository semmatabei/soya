import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import { TextInput } from './TextField.js';
import { name } from '../../../validator/string.js';

export default class NameInput extends React.Component {
  static connectId() {
    return 'NameField';
  }

  static getChangeValidators() {
    return [name];
  }

  render() {
    return <TextInput {...this.props} />;
  }
}

export default createField(NameInput);