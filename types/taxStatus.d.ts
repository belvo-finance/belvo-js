export default TaxStatus;
export type Response = import("../types/apiResponses").taxStatusResponse;
/**
 * @typedef { import("../types/apiResponses").taxStatusResponse } Response
 */
/**
 * Retrieve tax status information from a specific fiscal link.
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
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo.
     * @param {boolean} [options.attachPDF] - If `true`, you will receive the PDF as a binary string.
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
