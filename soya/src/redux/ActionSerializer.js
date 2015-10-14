/**
 * Accepts list of redux actions and runs them one after another. If the
 * return value when dispatching is a promise or promise-like object (has
 * then() method) - it will use it to run the next action in line.
 *
 * @CLIENT_SERVER
 */
export default class ActionSerializer {

}