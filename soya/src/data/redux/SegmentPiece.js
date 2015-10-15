/**
 * Represents a piece of the segment state.
 *
 * @CLIENT_SERVER
 */
export default class SegmentPiece {
  /**
   * The real data, null when never fetched.
   * @type {void | any}
   */
  data;

  /**
   * Array of errors. Will
   * @type {void | any}
   */
  errors;
}