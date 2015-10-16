import React from 'react';

import uuid from './uuid.js';

/**
 * Components that wanted to use Soya's redux container may use this.
 *
 * @CLIENT_SERVER
 */
export default class ContextualComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps() {

  }

  componentWillMount() {
    var b = function(arg) {
      console.log('HAHAHA');
      console.log(arg);
      console.log();
    };
    b(this);
    this.__soyaUuid = uuid.v4();
    this.registerStores();
  }

  componentWillUnmount() {

  }

  registerStores() {

  }
}