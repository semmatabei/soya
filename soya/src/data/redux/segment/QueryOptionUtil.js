const DEFAULT_QUERY_OPTION = {
  cache: false,
  cacheTtlMsec: null
};

/**
 * Query option utilities for default Segment implementations. All default
 * implementations should support options defined here.
 *
 * @CLIENT_SERVER
 */
export default {
  /**
   * Initialize and validate options.
   *
   * @param {?Object} options
   */
  initOptions(options) {
    options = options ? options : {};
    if (!options.cache) options.cache = DEFAULT_QUERY_OPTION.cache;
    if (options.cache && !options.cacheTtlMsec) options.cacheTtlMsec = 5 * 60 * 1000;
    return options;
  },

  /**
   * @param {Object} optionA
   * @param {Object} optionB
   */
  mergeOptions(optionA, optionB) {
    var tempA, tempB;
    var result = {
      cache: optionA.cache && optionB.cache
    };
    if (result.cache) {
      tempA = optionA.cacheTtlMsec ? optionA.cacheTtlMsec : 0;
      tempB = optionB.cacheTtlMsec ? optionB.cacheTtlMsec : 0;
      result.cacheTtlMsec = tempA < tempB ? tempA : tempB;
      if (result.cacheTtlMsec == 0) result.cacheTtlMsec = 5 * 60 * 1000;
    }
    return result;
  }
};