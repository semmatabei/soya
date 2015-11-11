/**
 * Helper class that can poll segment queries for the user. Accept poll
 * requirements per query and merges them together. At any moment, poll
 * requirement may be withdrawn, resulting in a re-merged poll settings, and
 * potentially the abandoning of the poll altogether.
 *
 * This is set up so that multiple components can request to poll a particular
 * query of a segment without needing to coordinate themselves. When they
 * mount, they create a poll request, and when they un-mount, they withdraw
 * the poll request.
 *
 * @CLIENT_SERVER
 */
export default class DataPoller {
  // TODO: Implement
}