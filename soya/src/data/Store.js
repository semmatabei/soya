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
   * Tells this Store that upon first Segment conflict, it has to nullify the
   * Segment's state, second conflict throws error as usual.
   *
   * IMPORTANT NOTE: This only happens on first Segment conflict - second
   * conflict means there are indeed Segment name clash, and Store should
   * rightfully throw an Error.
   */
  _mayHotReloadSegments() {
    throw new Error('Abstract method not implemented.');
  }

  /**
   * Called by framework code before it starts rendering.
   */
  _startRender() {

  }

  /**
   * Called by framework code after render is complete.
   */
  _endRender() {

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