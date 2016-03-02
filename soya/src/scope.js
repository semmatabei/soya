/**
 * Users can require this file to create a conditional block that runs only on
 * server-side or client-side.
 *
 * <pre>
 *   if (at.server) {
 *     ....
 *   }
 * </pre>
 *
 * @SERVER
 */
export default {
  server: true,
  client: false
};