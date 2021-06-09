export default RequestError;
/**
 * Represent requests that returned status different than 2xx
 */
declare class RequestError extends Error {
    /**
     * Create a request error exception.
     * @param {number} statusCode - HTTP status code of the response.
     * @param {array|object} detail - List or single object describing the error.
     * @param  {...any} params - Additional error parameters (used by parent class)
     */
    constructor(statusCode: number, detail: any[] | object, ...params: any[]);
    statusCode: number;
    detail: any;
}
