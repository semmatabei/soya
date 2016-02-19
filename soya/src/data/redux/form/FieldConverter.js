import React from 'react';
import update from 'react-addons-update';

import connect from '../connect.js';
import FormSegment from './FormSegment.js';

/**
 * @CLIENT_SERVER
 */
export default class FieldConverter {
  /**
   * @type {ReduxStore}
   */
  _reduxStore;

  /**
   * @type {string}
   */
  _formId;

  constructor(formId, reduxStore) {
    this._reduxStore = reduxStore;
    this._formId = formId;
  }

  convert(InputComponent) {
    var type = typeof InputComponent.getQueryType == 'function' ? 'field' : InputComponent.getQueryType();
    var validators = typeof InputComponent.getOnChangeValidators == 'function' ? [] : InputComponent.getOnChangeValidators();
    var self = this;

    // Recognizes the following props:
    // - changeHandlers
    // - changeValidators
    class Component extends React.Component {
      __handleChange;

      static getSegmentDependencies() {
        return [FormSegment];
      }

      static subscribeQueries(nextProps, subscribe) {
        var name = nextProps.name;
        subscribe(FormSegment.id(), {formId: self._formId, type: type, fieldName: name}, value);
      }

      constructor(props, context) {
        super(props, context);
        this.__handleChange = this.handleChange.bind(this);
      }

      render() {
        // Pass appropriate props to the InputComponent.
        var key, props = {};
        for (key in this.props) {
          if (!this.props.hasOwnProperty(key)) continue;
          if (key == 'result' || key == 'onChangeHandlers' || key == 'changeValidators') continue;
          props[key] = this.props[key];
        }
        props.value = this.props.result.value;
        props.handleChange = this.__handleChange;
        return <InputComponent key="main" {...props} />;
      }

      handleChange(value) {
        console.log('HANDLE CHANGE', value);
      }
    }

    return connect(Component);
  }
}