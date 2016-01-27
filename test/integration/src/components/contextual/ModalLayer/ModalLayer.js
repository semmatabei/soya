import React from 'react';
import ReactDOM from 'react-dom';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';

import ModalSegment from '../../../segments/ModalSegment.js';
import style from './style.css';

/**
 * @CLIENT_SERVER
 */
export default class ModalLayer extends DataComponent {
  static getSegmentDependencies() {
    return [ModalSegment];
  }

  subscribeQueries(nextProps) {
    this.subscribe(ModalSegment.id(), '', 'modals');
  }

  render() {
    var modalWindowTypes = {}, modalWindows = [], modalElement, i;
    var childrenElements = React.Children.toArray(this.props.children);
    for (i = 0; i < childrenElements.length; i++) {
      modalElement = childrenElements[i];
      if (typeof modalElement.type.modalType != 'string') {
        throw new Error('Modal window error found without modalType static property: ' +
          modalElement.type.name);
      }
      modalWindowTypes[modalElement.type.modalType] = modalElement;
    }

    var modal, type, id, data;
    for (i = 0; i < this.state.modals.length; i++) {
      modal = this.state.modals[i];
      console.log(modal);

      type = modal.modalType;
      id = modal.modalId;
      data = modal.data;
      modalElement = modalWindowTypes[type];
      if (modalElement == null) {
        throw new Error('Modal window type is unknown: \'' + type + '\'.');
      }
      modalWindows.push(React.cloneElement(modalElement, {
        id: id,
        key: id,
        data: data
      }));
    }

    if (modalWindows.length <= 0) {
      console.log('KJHLHLKJ:LKJ');
      return null;
    }

    return <div>
      <div className={style.modalOverlay}></div>
      <div className="modalLayer">{modalWindows}</div>
    </div>;
  }
}