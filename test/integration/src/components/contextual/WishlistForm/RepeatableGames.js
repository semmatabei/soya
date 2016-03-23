import React from 'react';
import createRepeatable from 'soya/lib/data/redux/form/createRepeatable';

import TextField from '../../common/TextField/TextField';
import style from './style.css';

export class GamesFieldSet extends React.Component {
  render() {
    return <div className={style.repeatable}>
      <a href="javascript:void(0)" onClick={this.props.removeListItem.bind(null, this.props.index)}>Remove</a>
      <a href="javascript:void(0)" onClick={this.props.reorderListItemInc.bind(null, this.props.index, 1)}>Down</a>
      <a href="javascript:void(0)" onClick={this.props.reorderListItemDec.bind(null, this.props.index, 1)}>Up</a>
      <h5>Game {this.props.index + 1}</h5>
      <TextField form={this.props.form} name={this.props.name(['name'])} label="Name"
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <TextField form={this.props.form} name={this.props.name(['genre'])} label="Genre"
                 reduxStore={this.props.reduxStore} config={this.props.config} />
    </div>;
  }
}

export default createRepeatable(GamesFieldSet);