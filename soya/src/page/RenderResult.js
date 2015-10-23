import Cookie from './Cookie.js';
import Bucket from '../Bucket';

var STATUS_MESSAGES = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',

  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',

  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',
  419: 'Authentication Timeout',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  440: 'Login Timeout',
  444: 'No Response',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTPS Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  509: 'Bandwith Limit Exceeded',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

/**
 * @CLIENT-SERVER
 */
export default class RenderResult {
  /**
   * @type {ContentRenderer}
   */
  contentRenderer;

  /**
   * @type {?Store}
   */
  store;

  /**
   * @type {[key: string]: Cookie}
   */
  cookies;

  /**
   * @type {Bucket}
   */
  httpHeaders;

  /**
   * @type {number}
   */
  httpStatusCode;

  /**
   * @type {string}
   */
  httpStatusMessage;

  /**
   * NOTE: Application itself is not aware that we are using webpack or react,
   * thus this class should also be unaware of that fact.
   *
   * @param {?ContentRenderer} contentRenderer
   * @param {?Store} store
   */
  constructor(contentRenderer, store) {
    this.contentRenderer = contentRenderer;
    this.store = store;
    this.httpHeaders = new Bucket();
    this.cookies = {};
    this.httpStatusCode = 200;
    this.httpStatusMessage = STATUS_MESSAGES[this.httpStatusCode];
  }

  /**
   * If status message is empty, default status message will be used. If no
   * default status message exist, empty string will be used.
   *
   * @param {number} statusCode
   * @param {?string} statusMessage
   */
  setStatusCode(statusCode, statusMessage) {
    this.httpStatusCode = statusCode;
    if (!statusMessage) statusMessage = STATUS_MESSAGES[statusCode];
    if (!statusMessage) statusMessage = '';
    this.httpStatusMessage = statusMessage;
  }

  /**
   * Add a set cookie header to the response.
   *
   * @param {Cookie} cookie
   */
  setCookie(cookie) {
    if (!(cookie instanceof Cookie)) {
      throw new Error('Expected cookie, this given instead: ' + cookie);
    }
    this.cookies[cookie.name] = cookie;
  }

  /**
   * @param {string} cookieName
   * @param {string} domain
   * @param {?string} path
   */
  removeCookie(cookieName, domain, path) {
    this.cookies[cookieName] = Cookie.createRemoval(cookieName, domain, path);
  }
}