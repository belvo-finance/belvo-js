export default TaxComplianceStatus;
export type Response = import("../types/apiResponses").taxComplianceStatusResponse;
/**
 * @typedef { import("../types/apiResponses").taxComplianceStatusResponse } Response
 */
/**
 * Retrieve tax compliance status information from a specific fiscal link.
 * @extends Resource<Response>
 */
declare class TaxComplianceStatus extends Resource<import("../types/apiResponses").taxComplianceStatusResponse> {
    constructor(session: any);
    /**
     * Retrieve tax compliance status information from a specific fiscal link.
     *
     * @async
     * @param {string} link - UUID4 representation of a `link` Id.
     * @param {object} [options] - Optional parameters (`saveData`, `attachPDF`)
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo.
     * @param {boolean} [options.attachXML] - If `true`, you will receive the XML invoice.
     * @returns {Promise<Response>} Response
     * @throws {RequestError}
     */
    retrieve(link: string, options?: {
        saveData?: boolean;
        attachXML?: boolean;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
