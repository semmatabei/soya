import React from 'react';

import BaseModal from '../BaseModal/BaseModal.js';
import style from './style.css';

/**
 * @CLIENT_SERVER
 */
export default class ConfirmModal extends React.Component {
  static getCancelEvent(modalId) {
    return ConfirmModal.modalType + '.' + 'cancel.' + modalId;
  }

  static getConfirmEvent(modalId) {
    return ConfirmModal.modalType + '.' + 'confirm.' + modalId;
  }

  static get modalType() {
    return 'confirm';
  }

  handleOk() {
    this.props.emitter.emit(ConfirmModal.getConfirmEvent(this.props.id));
  }

  handleCancel() {
    this.props.emitter.emit(ConfirmModal.getCancelEvent(this.props.id));
    this.props.removeSelf();
  }

  render() {
    return <BaseModal level={this.props.level}>
      <h3>Confirm</h3>
      <p>{this.props.data.text}</p>
      <a className={style.okButton} onClick={this.handleOk.bind(this)}>OK</a>
      <a className={style.cancelButton} onClick={this.handleCancel.bind(this)}>Cancel</a>
    </BaseModal>;
  }
}