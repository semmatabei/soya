/**
 * @SERVER
 */
export default class EntryPoint {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  rootAbsolutePath;

  /**
   * @param {string} name
   * @param {string} rootAbsolutePath
   */
  constructor(name, rootAbsolutePath) {
    this.rootAbsolutePath = rootAbsolutePath;
    this.name = name;
  }
}
