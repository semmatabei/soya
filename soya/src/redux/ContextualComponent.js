import React from 'react';

import Container from './Container.js';
import uuid from './uuid.js';

/**
 * Components that wanted to use Soya's redux container may use this.
 *
 * @CLIENT_SERVER
 */
export default class ContextualComponent extends React.Component {
  static get propTypes() {
    return {
      container: React.PropTypes.instanceOf(Container)
    };
  }

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.__soyaUuid = uuid.v4();
    this.registerStores();
  }

  componentWillUnmount() {
    this.container.unsubscribeAll();
  }

  registerStores() {

  }
}

