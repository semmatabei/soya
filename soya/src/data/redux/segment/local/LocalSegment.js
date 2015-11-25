import Segment from '../../Segment.js';

/**
 * @CLIENT_SERVER
 */
export default class LocalSegment {
  /**
   * @returns {boolean}
   */
  static shouldHydrate() {
    return false;
  }
}