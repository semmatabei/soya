import React from 'react';

import { isEqualShallow } from '../helper.js';
import FormSegment from './FormSegment.js';
import connect from '../connect.js';

/**
 * Wraps the given InputComponent in a component that links to FormSegment with
 * the following contract:
 *
 * 1) InputComponent must get value from props.value when rendering.
 * 2) InputComponent must run props.handleChange when the value changes.
 * 3) InputComponent may run props.handleAsyncChange if it wants to be able to
 *    run async validation and async change handlers.
 *
 * Accepts the following special props:
 *
 * 1) reduxStore
 * 2) config
 * 3) changeHandlers (array of functions, optional)
 * 4) changeValidators (array of functions, optional)
 * 5) asyncChangeValidators (array of functions, optional)
 *
 * Any other props will be passed on to the wrapped input component untouched.
 *
 * @param {React.Component} InputComponent
 * @return {ReactComponent}
 */
export default function createField(InputComponent) {
  var type = typeof InputComponent.getQueryType == 'function' ? InputComponent.getQueryType() : 'field';
  var inputValidators = typeof InputComponent.getOnChangeValidators == 'function' ? InputComponent.getOnChangeValidators() : [];

  class Component extends React.Component {
    __handleChange;
    __handleAsyncChange;

    static connectId() {
      return InputComponent.connectId ? InputComponent.connectId() : 'Field Component';
    }

    static getSegmentDependencies() {
      return [FormSegment];
    }

    static subscribeQueries(nextProps, subscribe) {
      subscribe(FormSegment.id(), {
        formId: nextProps.form._formId,
        type: type,
        fieldName: nextProps.name
      }, 'field');
    }

    constructor(props, context) {
      super(props, context);
      this.__handleChange = this.handleChange.bind(this);
      this.__handleAsyncChange = this.handleAsyncChange.bind(this);
    }

    render() {
      // Pass appropriate props to the InputComponent.
      var key, props = {};
      for (key in this.props) {
        if (!this.props.hasOwnProperty(key)) continue;
        if (key == 'result' || key == 'changeHandlers' || key == 'validators' || key == 'validatorsAsync') continue;
        props[key] = this.props[key];
      }

      if (this.props.result.field) {
        props.value = this.props.result.field.value;
        props.errorMessages = this.props.result.field.errorMessages;
        props.touched = this.props.result.field.touched;
        props.isValidating = this.props.result.field.isValidating;
      } else {
        props.value = null;
        props.errorMessages = [];
        props.touched = false;
        props.isValidating = false;
      }

      props.handleChange = this.__handleChange;
      props.handleAsyncChange = this.__handleAsyncChange;

      // For performance optimizations, InputComponent may implement
      // shouldComponentUpdate that checks for changes in props.
      // TODO: Since all input component's props are already known by this wrapper, we could implement the checker ourselves, thereby users don't need to implement it over and over again.
      return <InputComponent key="main" {...props} />;
    }


    handleChange(value, event) {
      // Run validation.
      var i, result, errorMessages = [];
      for (i = 0; i < inputValidators.length; i++) {
        result = inputValidators[i](value);
        if (result !== true) errorMessages.push(result);
      }
      if (this.props.changeValidators) {
        for (i = 0; i < this.props.changeValidators.length; i++) {
          result = this.props.changeValidators[i](value);
          if (result !== true) errorMessages.push(result);
        }
      }

      var actions = this.props.getActionCreator(FormSegment.id());
      if (errorMessages.length == 0) {
        this.props.getReduxStore().dispatch(actions.setValue(
          this.props.form._formId, this.props.name, value
        ));
      } else {
        this.props.getReduxStore().dispatch(actions.mergeFields(
          this.props.form._formId, {
            [this.props.name]: {
              value: value,
              touched: true,
              errorMessages: errorMessages
            }
          })
        );
      }
    }

    /**
     * Async change handler doesn't update value - we assume that handleChange
     * is already run and thus value in FormSegment is already updated. This
     * event is useful to run asynchronous change handlers, especially for
     * asynchronous field validation.
     *
     * @param {?} value
     * @param {Event} event
     */
    handleAsyncChange(value, event) {
      // TODO Run async validators.
      // TODO Run async
    }
  }

  return connect(Component);
}