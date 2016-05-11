import ReactDOMServer from 'react-dom/server';
import ContentRenderer from '../ContentRenderer';

/**
 * TODO: Upgrade to react 0.14.0!
 *
 * @SERVER
 */
export default class ReactRenderer extends ContentRenderer {
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
   * TODO: Send http request headers, request method, etc - if a config knob is turned on!
   * TODO: Find out a library for escaping URLs to be put in HTML.
   * TODO: Also print reverse routing data.
   *
   * @param {Object} routeArgs
   * @param {Object} routes
   * @param {Object} clientConfig
   * @param {any} hydratedState
   * @param {Object} pageDependencies
   * @returns {string}
   */
  render(routeArgs, routes, clientConfig, hydratedState, pageDependencies) {
    var result = '<html>';
    result += '<head>';
    if (this.head) result += this.head;

    result += '<script type="text/javascript">';
    result += 'var config = ' + JSON.stringify(clientConfig) + ';';
    result += 'var routeArgs = ' + JSON.stringify(routeArgs) + ';';
    result += 'var routes = ' + JSON.stringify(routes) + ';';
    result += 'var hydratedState = ' + JSON.stringify(hydratedState) + ';';
    result += '</script>';

    var i, url;
    for (i = 0; i < pageDependencies.cssDependencies.length; i++) {
      url = pageDependencies.cssDependencies[i];
      result += '<link rel="stylesheet" type="text/css" href="' + url + '">';
    }

    result += '</head>';
    result += '<body><div id="__body">';
    if (this.body) result += ReactDOMServer.renderToString(this.body);
    result += '</div>';

    for (i = 0; i < pageDependencies.jsDependencies.length; i++) {
      url = pageDependencies.jsDependencies[i];
      result += '<script type="text/javascript" src="' + url + '"></script>';
    }

    result += '</body>';
    result += '</html>';
    return result;
  }
}