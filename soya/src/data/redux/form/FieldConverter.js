import React from 'react';

import DataComponent from '../DataComponent.js';
import FormSegment from './FormSegment.js';

/**
 * @CLIENT_SERVER
 */
export default class FieldConverter {
  _reduxStore;
  _formId;

  constructor(formId, reduxStore) {
    this._reduxStore = reduxStore;
    this._formId = formId;
  }

  convert(InputComponent) {
    var type = InputComponent.queryType ? 'field' : InputComponent.queryType();
    var self = this;
    // Recognizes the following props:
    // - changeHandlers
    // - changeValidators
    return class Component extends DataComponent {
      static getSegmentDependencies() {
        return [FormSegment];
      }

      subscribeQueries(nextProps) {
        var name = nextProps.name;
        this.subscribe(FormSegment.id(), {formId: self._formId, type: type, fieldName: name});
      }

      render() {
        var preppedProps = {};
        console.log(self._reduxStore);
        return <InputComponent {...preppedProps} />;
      }
    }
  }
}