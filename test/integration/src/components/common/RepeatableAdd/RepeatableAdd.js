import React from 'react';

import FormSegment from 'soya/lib/data/redux/form/FormSegment';

export default class RepeatableAdd extends React.Component {
  _actions;

  componentWillMount() {
    this._actions = this.props.reduxStore.register(FormSegment);
  }

  render() {
    return <p>
      <a href="javascript:void(0)" onClick={this.addListItem.bind(this)}>{this.props.label}</a>
    </p>;
  }

  addListItem() {
    this.props.reduxStore.dispatch(this._actions.addListItem(
      this.props.form.getFormId(), this.props.name, this.props.minLength
    ));
  }
}