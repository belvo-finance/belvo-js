class RequestError extends Error {
  constructor(statusCode, detail, ...params) {
    super(...params);
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export default RequestError;
