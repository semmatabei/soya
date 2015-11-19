/**
 * Used to write cookie in client. Will ignore requests if run at server.
 *
 * @CLIENT
 */
export default {
  /**
   * Creates a cookie for the given second.
   *
   * @param {string} name
   * @param {string} value
   * @param {number} msec
   * @param {string} domain
   * @param {boolean=} secure
   */
  writeMsec(name, value, msec, domain, secure) {
    var expires;
    if (msec) {
      var date = new Date();
      date.setTime(date.getTime()+(msec));
      expires = "; expires="+date.toGMTString();
    }
    else {
      expires = "";
    }

    var newCookie = name+"="+value+expires+"; path=/; domain="+domain;

    if (goog.isDefAndNotNull(secure) && secure) {
      newCookie += ";secure";
    }

    if (typeof document !== 'undefined' && document != null) {
      document.cookie = newCookie;
    }
  },

  /**
   * @param {string} name
   * @param {string} domain
   */
  remove(name, domain) {
    this.writeMsec(name, "", -1, domain);
  }
};