import React from 'react';

import style from './style.css';

export default class BaseModal extends React.Component {
  render() {
    var children = React.Children.toArray(this.props.children);
    return <div className={style.modal}>{children}</div>;
  }
}