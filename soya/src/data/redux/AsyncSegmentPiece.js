/**
 * Represents a segment piece that was fetched asynchronously.
 *
 * @CLIENT_SERVER
 */
export default class AsyncSegmentPiece {
  /**
   * @type {void | any}
   */
  data;

  /**
   * Array of errors. Will be null if there are no errors.
   * @type {void | Array<any>}
   */
  errors;

  /**
   * @type {boolean}
   */
  loaded;

  /**
   * Last updated timestamp.
   * @type {number}
   */
  timestamp;
}