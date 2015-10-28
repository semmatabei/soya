import ContentRendererClient from '../ContentRendererClient';
import React from 'react';

/**
 * TODO: Upgrade to react 0.14.0!
 *
 * @CLIENT
 */
export default class ReactRendererClient extends ContentRendererClient {
  /**
   * @type {string}
   */
  head;

  /**
   * @type {ReactElement}
   */
  body;

  /**
   * @param {?string} head
   * @param {?ReactElement} body
   */
  constructor(head, body) {
    super();
    this.head = head;
    this.body = body;
  }

  /**
   * TODO: History API navigation render.
   */
  render() {
    var domElement = document.getElementById('__body');
    window.reactElement = React.render(this.body, domElement);
    return function() {
      React.unmountComponentAtNode(domElement);
    };
  }
}