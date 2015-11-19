/**
 * Serves as the interface for the HttpRequest object that Page receives.
 * Methods inside this object is guaranteed to work consistently in both client
 * and server side.
 *
 * @CLIENT_SERVER
 */
export default class HttpRequest {
  /**
   * Returns the domain of the request. On server, this value is fetched from
   * the "Host" header. On client, this value is fetched from location bar.
   *
   * @return {string}
   */
  getDomain() {

  }
}