/**
 * Contract between the Store and Soya. This interface is needed to distinguish
 * framework concern for rendering and application concern for data fetching.
 *
 * Soya has a default implementation to use with Redux. Other implementations
 * may be created for other client-side architecture or data fetching library.
 *
 * @CLIENT_SERVER
 */
export default class Store {
  /**
   * @return {any}
   */
  _getState() {
    throw new Error('Abstract method not implemented.');
  }

  /**
   * @return {boolean}
   */
  shouldRenderBeforeServerHydration() {
    return false;
  }

  /**
   * Called by Soya server and client runtime when rendering pages. Calls the
   * given callback when all blocking render is complete.
   *
   * @param {RenderType} renderType
   * @return {Promise}
   */
  hydrate(renderType) {
    throw new Error('Abstract method not implemented.');
  }
}