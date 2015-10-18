/**
 * Responsible for rendering the content part of an HTTP response in Server.
 * This class defines interface between content renderer implementation and
 * Application.
 *
 * NOTE: There is an unclean separation separation of concerns between compiler
 * and ContentRenderer. The compiler needs to know client runtime, because it
 * has to generate entry point to create the dependencies. Which is why client
 * runtime generation is currently in Compiler. Part of ClientRuntime script
 * is client side rendering, which should use this class instead of hard-coding
 * to React.
 *
 * @SERVER
 */
export default class ContentRenderer {
  /**
   * @param {Object} routeArgs
   * @param {Object} clientConfig
   * @param {Object} pageDependencies
   * @param {boolean} isSecure
   * @returns {string}
   */
  render(routeArgs, clientConfig, pageDependencies, isSecure) {
    return '';
  }
}