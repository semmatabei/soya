import React from 'react';
import createField from 'soya/lib/data/redux/form/createField';

import { TextInput } from './TextField.js';
import { isName } from '../../../validator/string.js';

export default class NameInput extends React.Component {
  static connectId() {
    return 'NameField';
  }

  static getOnChangeValidators() {
    return [isName];
  }

  render() {
    return <TextInput {...this.props} />;
  }
}

export default createField(NameInput);