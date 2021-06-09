export default Resource;
/**
 * Represents a Belvo API resource
 * @template T
 * */
declare class Resource<T> {
    /**
     * Instantiate a resource.
     * @param {APISession} session - Belvo API session.
     */
    constructor(session: any);
    /** @private */
    private session;
    /**
     * Get a list of resources.
     * @async
     * @param {object} params - Receives two parameters.
     * @param {number} [params.limit=100] - Maximum number of results.
     * @param {object} [params.filters={}] - Filters to get custom results.
     * @returns { Promise<import("../types/apiResponses").listResponse<T>> } List of results.
     * @throws {RequestError}
     */
    list({ limit, filters }?: {
        limit?: number;
        filters?: object;
    }): Promise<import("../types/apiResponses").listResponse<T>>;
    /**
     * Get specific record details.
     * @async
     * @param {string} id - UUID4 representation of the resource Id.
     * @returns {Promise<T>}
     * @throws {RequestError}
     */
    detail(id: string): Promise<T>;
    /**
     * Delete specific record.
     * @async
     * @param {string} id - UUID4 representation of the resource Id.
     * @returns {Promise<boolean>} When the record is successfuly deleted returns true, otherwise false.
     */
    delete(id: string): Promise<boolean>;
    /**
     * Resume a "pending" session that requires an OTP token.
     * Use this function to resume sessions that returned HTTP 428 status code.
     * @async
     * @param {string} session - UUID4 representation of a "pending" session.
     * @param {string} token - OTP token.
     * @param {string} link - UUID4 representation of the link being used.
     * @returns {Promise<T>} Response.
     * @throws {RequestError}
     */
    resume(session: string, token: string, link: string): Promise<T>;
    #private;
}
