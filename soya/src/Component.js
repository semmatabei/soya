/**
 * @SERVER
 */
export default class Component {
  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  absDir;

  /**
   * @type {any}
   */
  clazz;

  constructor(name, absDir, clazz) {
    this.name = name;
    this.absDir = absDir;
    this.clazz = clazz;
  }
}