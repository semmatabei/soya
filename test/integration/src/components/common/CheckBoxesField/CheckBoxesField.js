import React from 'react';
import update from 'react-addons-update';
import createField from 'soya/lib/data/redux/form/createField';

import style from './style.mod.css';

export class CheckBoxesInput extends React.Component {
  render() {
    var i, value, id, boxes = [], currentValue = this.getCurrentValue();
    for (i = 0; i < this.props.options.length; i++) {
      value = this.props.options[i].value;
      id = 'CHK_' + this.props.form.getFormId() + this.props.name + '_' + i;
      boxes.push(
        <div key={id}>
          <input type="checkbox" checked={currentValue[value]} id={id}
                 value={value} onChange={this.handleCheck.bind(this)}
                 disabled={this.props.isDisabled} />
          <label htmlFor={id}>{this.props.options[i].label}</label>
        </div>
      );
    }

    return <div className={style.checkBoxes}>
      <label>{this.props.label}</label>
      {boxes}
      {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
    </div>;
  }

  handleCheck(event) {
    var nextValue, value = event.target.value;
    var isChecked = event.target.checked;
    var currentValue = this.getCurrentValue();
    if (isChecked) {
      nextValue = update(currentValue, {
        [value]: {$set: true}
      });
    } else {
      nextValue = update(currentValue, {
        [value]: {$set: false}
      });
    }
    this.props.handleChange(nextValue);
  }

  getCurrentValue() {
    return this.props.value ? this.props.value : {};
  }
}

export default createField(CheckBoxesInput);