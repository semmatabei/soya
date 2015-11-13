/**
 * Responsible for containing
 *
 * TODO: Implement.
 *
 * @CLIENT_SERVER
 */
export default class QueryDependencies {
  /**
   * @type {boolean}
   */
  isParallel;

  /**
   * @param {boolean} isParallel
   */
  constructor(isParallel) {
    this.isParallel = isParallel;
  }

  /**
   * @returns {QueryDependencies}
   */
  static parallel() {
    return new QueryDependencies(true);
  }

  /**
   * @returns {QueryDependencies}
   */
  static serial() {
    return new QueryDependencies(false);
  }


}
