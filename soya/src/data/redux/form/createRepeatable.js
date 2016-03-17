import React from 'react';

import { isArray } from '../helper.js';
import PromiseUtil from '../PromiseUtil.js';
import FormSegment from './FormSegment.js';
import connect from '../connect.js';

/**
 * This function will wrap the given react component into a Repeatable
 * component. Repeatable component will render the given component as many as
 * the length of the list pointed out by the name props.
 *
 * Wrapper will provide special function props, along with essential reduxStore
 * and config to the field set component.
 *
 * @param {React.Component} FieldSetComponent
 * @return {React.Component}
 *
 * @CLIENT_SERVER
 */
export default function createRepeatable(FieldSetComponent) {
  // TODO: Move each method into separate functions above so they are reused instead of being recreated every call.
  class Component extends React.Component {
    _nameFuncCache;
    _addListItemFunc;
    _removeListItemFunc;
    _reorderListItemIncFunc;
    _reorderListItemDecFunc;
    _reorderListItemFunc;
    _baseName;

    static connectId() {
      return FieldSetComponent.connectId ? FieldSetComponent.connectId() : 'Repeatable Field Component';
    }

    static getSegmentDependencies() {
      return [FormSegment];
    }

    static subscribeQueries(props, subscribe) {
      subscribe(FormSegment.id(), {
        formId: this.props.form._formId,
        type: 'length',
        fieldName: this.props.name
      }, 'length')
    }

    static shouldSubscriptionsUpdate(props, nextProps) {
      return (
        props.form !== nextProps.form ||
        props.name !== nextProps.name
      );
    }

    constructor(props, context) {
      super(props, context);
      this._nameFuncCache = [];
      this._addListItemFunc = this.addListItem.bind(this);
      this._removeListItemFunc = this.removeListItem.bind(this);
      this._reorderListItemIncFunc = this.reorderListItemInc.bind(this);
      this._reorderListItemDecFunc = this.reorderListItemDec.bind(this);
      this._reorderListItemFunc = this.reorderListItem.bind(this);
    }

    componentWillMount() {
      this._baseName = isArray(this.props.name) ?
        this.props.name : [this.props.name];
    }

    componentWillReceiveProps(nextProps) {
      this._baseName = isArray(nextProps.name) ?
        nextProps.name : [nextProps.name];
    }

    shouldComponentUpdate(nextProps, nextState) {
      // We don't use state, so we don't have to check it. But we do have to
      // check for props.
      return !isEqualShallow(nextProps, this.props);
    }

    render() {
      var i, props = {}, fieldSetList = null;
      if (this.props.result.length > 0) {
        fieldSetList = [];
        props.reduxStore = this.props.reduxStore;
        props.addListItem = this._addListItemFunc;
        props.removeListItem = this._removeListItemFunc;
        props.reorderListItemInc = this._reorderListItemIncFunc;
        props.reorderListItemDec = this._reorderListItemDecFunc;
        props.reorderListItem = this._reorderListItemFunc;
        props.config = this.props.config;
        for (i = 0; i < this.props.result.length; i++) {
          props.index = i;
          props.name = this.getNameFunc(i);
          fieldSetList.push(<FieldSetComponent key={i} {...props} />);
        }
      }
      return <div>
        {fieldSetList}
      </div>;
    }

    /**
     * @param {number} index
     * @param {Array<string>|string} fieldName
     * @returns {Array<string>}
     */
    name(index, fieldName) {
      return this._baseName.concat(index).concat(fieldName);
    }

    /**
     * @param {number} index
     */
    removeListItem(index) {
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.reduxStore.dispatch(actions.removeListItem(
        this.props.form._formId, this.props.name, index
      ));
    }

    addListItem() {
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.reduxStore.dispatch(actions.addListItem(
        this.props.form._formId, this.props.name
      ));
    }

    /**
     * @param {number} index
     * @param {number} amount
     */
    reorderListItemInc(index, amount) {
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.reduxStore.dispatch(actions.reorderListItemInc(
        this.props.form._formId, this.props.name, index, amount
      ));
    }

    /**
     * @param {number} index
     * @param {number} amount
     */
    reorderListItemDec(index, amount) {
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.reduxStore.dispatch(actions.reorderListItemDec(
        this.props.form._formId, this.props.name, index, amount
      ));
    }

    /**
     * @param {number} index
     * @param {number} targetIndex
     */
    reorderListItem(index, targetIndex) {
      var actions = this.props.getActionCreator(FormSegment.id());
      this.props.reduxStore.dispatch(actions.reorderListItem(
        this.props.form._formId, this.props.name, index, targetIndex
      ));
    }

    getNameFunc(index) {
      if (!this._nameFuncCache.length.hasOwnProperty(index)) {
        this._nameFuncCache[index] = this.name.bind(this, index);
      }
      return this._nameFuncCache[index];
    }
  }

  return connect(Component);
};