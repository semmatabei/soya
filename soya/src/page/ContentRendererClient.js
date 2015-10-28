/**
 * Responsible for rendering content at client. This class is used in tandem
 * with a server-side version.
 *
 * @CLIENT
 */
export default class ContentRendererClient {
  /**
   * Renders directly to DOM, does not return anything. Returns a dismantle
   * function. Called when the page is about to be dismantled, to be replaced by
   * another page in page navigation or hot reload.
   *
   * @return {Function}
   */
  render() {

  }
}