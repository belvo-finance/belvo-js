class RequestError extends Error {
  constructor(statusCode, message, ...params) {
    super(...params);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default RequestError;
