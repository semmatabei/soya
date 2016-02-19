import React from 'react';

import FormSegment from './FormSegment.js';
import connect from '../connect.js';

/**
 * Wraps the given InputComponent in a component that links to FormSegment with
 * the following contract:
 *
 * 1) InputComponent must get value from props.value when rendering.
 * 2) InputComponent must run props.handleChange when the value changes.
 *
 * @param {React.Component} InputComponent
 * @return {ReactComponent}
 */
export default function createField(InputComponent) {
  var type = typeof InputComponent.getQueryType == 'function' ? InputComponent.getQueryType() : 'field';
  var validators = typeof InputComponent.getOnChangeValidators == 'function' ? InputComponent.getOnChangeValidators() : [];

  // Recognizes the following props:
  // - changeHandlers
  // - changeValidators
  class Component extends React.Component {
    __handleChange;

    static getSegmentDependencies() {
      return [FormSegment];
    }

    static subscribeQueries(nextProps, subscribe) {
      subscribe(FormSegment.id(), {formId: nextProps.formId, type: type, fieldName: nextProps.name}, 'field');
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
      props.value = this.props.result.field.value;
      props.errorMessages = this.props.result.field.errorMessages;
      props.touched = this.props.result.field.touched;
      props.isValidating = this.props.result.field.isValidating;
      props.handleChange = this.__handleChange;
      return <InputComponent key="main" {...props} />;
    }

    handleChange(value, event) {
      console.log('HANDLE CHANGE', value);
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.getReduxStore().dispatch(actions.setValue(
        this.props.formId, this.props.name, value
      ));
    }
  }

  return connect(Component);
}