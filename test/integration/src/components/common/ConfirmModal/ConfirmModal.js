import React from 'react';

import style from './style.css';

/**
 * @CLIENT_SERVER
 */
export default class ConfirmModal extends React.Component {
  static get modalType() {
    return 'confirm';
  }

  render() {
    console.log(this.props);
    return <div className={style.modal}>
      <h3>Confirm</h3>
      <p>{this.props.data.text}</p>
    </div>;
  }
}