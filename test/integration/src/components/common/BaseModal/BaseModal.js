import React from 'react';

import style from './style.css';

export default class BaseModal extends React.Component {
  render() {
    var children = React.Children.toArray(this.props.children);
    var topOffset = 250;
    var leftOffset = 200;
    var width = 300;
    var modalStyle = {
      top: (topOffset + this.props.level * 30) + 'px',
      left: '50%',
      width: width + 'px',
      marginLeft: (-width + this.props.level * 30) + 'px'
    };
    return <div className={style.modal} style={modalStyle}>{children}</div>;
  }
}