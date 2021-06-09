export default APISession;
/** Class representing an active Belvo API session */
declare class APISession {
    /**
     * Create a session.
     * @param {string} url - Belvo API host URL.
     */
    constructor(url: string);
    session: import("axios").AxiosInstance;
    /**
     * Login to Belvo API using secret key credentials.
     * @async
     * @param {string} secretKeyId - The Id of the key.
     * @param {string} secretKeyPassword - The password of the key.
     * @returns {boolean} true when login is sucessful else false.
     */
    login(secretKeyId: string, secretKeyPassword: string): boolean;
    keyId: string;
    keyPassword: string;
    /**
     * Get all results from a paginated response
     * @async
     * @param {string} url - API endpoint
     * @param {object} params - Params to filter results in get.
     * @yields {object} The next result in the response.
     */
    getAll(url: string, params?: object): any;
    /**
     * Get a list of resources.
     * @async
     * @param {string} url - API endpoint
     * @param {number} limit - Maximum number of results to get.
     * @param {object} params - Params to filter results in get.
     * @returns {array} List of resources.
     */
    list(url: string, limit?: number, params?: object): any[];
    /**
     * Get details of a specific resource.
     * @async
     * @param {str} url - API endpoint
     * @param {string} id - UUID4 representing the resource id.
     * @returns {object}
     */
    get(url: any, id: string): object;
    /**
     * Do a POST request to the API.
     * @async
     * @param {string} url - API endpoint.
     * @param {object} payload - JSON request payload.
     * @returns {object} Response
     * @throws {RequestError}
     */
    post(url: string, payload: object): object;
    /**
     * Do a PATCH request to the API.
     * @async
     * @param {string} url - API endpoint.
     * @param {object} payload - Response
     * @returns {object} Response
     * @throws {RequestError}
     */
    patch(url: string, payload: object): object;
    /**
     * Do a PUT request to the API.
     * @async
     * @param {string} url - API endpoint.
     * @param {string} id - UUID4 representing the resource Id.
     * @param {object} payload - JSON request payload.
     * @throws {RequestError}
     */
    put(url: string, id: string, payload: object): Promise<any>;
    /**
     * Do a DELETE request to the API.
     * @async
     * @param {stroing} url - API endpoint.
     * @param {string} id - UUID4 representing the resource Id.
     * @returns {boolean}
     * @throws {RequestError}
     */
    delete(url: any, id: string): boolean;
}
