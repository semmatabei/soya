/**
 * Contains web URL to the resource (without the protocol).
 */

/**
type PageDependencies = {
  cssDependencies: Array<string>;
  jsDependencies: Array<string>;
};
**/

/**
 * @SERVER
 */
export default class CompileResult {
  /**
   * @type {{[key: string]: PageDependencies}}
   */
  pages;

  constructor() {
    this.pages = {};
  }
}
