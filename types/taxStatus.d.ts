export default TaxStatus;
/**
 * Retrieve tax status information from a specific fiscal link.
 */
export type Response = import("../types/apiResponses").taxStatusResponse;
/**
 * Retrieve tax status information from a specific fiscal link.
 * @typedef { import("../types/apiResponses").taxStatusResponse } Response
 * @extends Resource<Response>
 */
declare class TaxStatus extends Resource<import("../types/apiResponses").taxStatusResponse> {
    constructor(session: any);
    /**
     * Retrieve tax status information from a specific fiscal link.
     *
     * @async
     * @param {string} link - UUID4 representation of a link Id.
     * @param {object} [options] - Optional parameters (`saveData`, `attachPDF`)
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to `false`, the data won't be persisted.
     * @param {boolean} [options.attachPDF] - When this is set to `true`, you will receive the PDF as a binary string in the response.
     * @returns {Promise<Response>} Response
     * @throws {RequestError}
     */
    retrieve(link: string, options?: {
        saveData?: boolean;
        attachPDF?: boolean;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
