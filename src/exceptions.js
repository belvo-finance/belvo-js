/**
 * Represent requests that returned status different than 2xx
 */
class RequestError extends Error {
  /**
   * Create a request error exception.
   * @param {number} statusCode - HTTP status code of the response.
   * @param {array|object} detail - List or single object describing the error.
   * @param  {...any} params - Additional error parameters (used by parent class)
   */
  constructor(statusCode, detail, ...params) {
    super(...params);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export default RequestError;
