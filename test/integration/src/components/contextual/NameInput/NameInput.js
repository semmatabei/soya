import React from 'react';

import TextInput from '../../common/TextInput/TextInput.js';
import { isName } from '../../../validator/string.js';

export default class NameInput extends React.Component {
  static getOnChangeValidators() {
    return [isName];
  }

  render() {
    return <TextInput {...this.props} />;
  }
}