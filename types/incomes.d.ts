export default Income;
export type Response = import("../types/apiResponses").incomesResponse;
/**
 * @typedef { import("../types/apiResponses").incomesResponse } Response
 */
/**
 * An Income contains a resume of monthly income Transaction in a Link.
 * @extends Resource<Response>
 */
declare class Income extends Resource<import("../types/apiResponses").incomesResponse> {
    constructor(session: any);
    /**
     * Retrieve income information from a specific banking link.
     *
     * @async
     * @param {string} link - UUID4 representation of a link Id.
     * @param {object} [options] - Optional parameters (saveData)
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo.
     * @returns {Promise<Response>} Response
     * @throws {RequestError}
     */
    retrieve(link: string, options?: {
        saveData?: boolean;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
