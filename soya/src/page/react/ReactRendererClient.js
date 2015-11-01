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
    if (module.hot) {
      // If hot-reloading is in place, we replace the <head> too.
      // Later, with history API navigation we'll have to figure out a way
      // to know *when* we *need* to do this instead of blindly rewriting
      // <head> every-time we need to render.
      // TODO: Won't work, <head> contains hot-reload scripts and CSS.
    }

    var domElement = document.getElementById('__body');
    window.reactElement = React.render(this.body, domElement);
    return function() {
      React.unmountComponentAtNode(domElement);
    };
  }
}