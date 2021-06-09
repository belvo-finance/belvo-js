export default Invoice;
/**
 * An Invoice is the representation of an electronic invoice,
 * that can be received or sent, by a business or an individual
 * and has been uploaded to the fiscal institution website.
 */
export type Response = import("../types/apiResponses").invoicesResponse;
/**
 * An Invoice is the representation of an electronic invoice,
 * that can be received or sent, by a business or an individual
 * and has been uploaded to the fiscal institution website.
 * @typedef { import("../types/apiResponses").invoicesResponse } Response
 * @extends Resource<Response>
 */
declare class Invoice extends Resource<import("../types/apiResponses").invoicesResponse> {
    constructor(session: any);
    /**
     * Retrieve invoices information from a specific fiscal link.
     * You can ask for a maximum of 1 year of invoices per request,
     * if you need more you need to do multiple requests.
     *
     * @async
     * @param {string} link UUID4 representation of a link Id.
     * @param {string} dateFrom - Required date from, format is `YYYY-MM-DD`.
     * @param {string} dateTo - Required date to, format is `YYYY-MM-DD`.
     * @param {string} type - Required type, it can be `'INFLOW'` or `'OUTFLOW'`.
     * @param {object} [options] - Optional parameters (`token`, `saveData`, `attachXML`)
     * @param {string} [options.token] - The OTP token generated by the bank.
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to `false`, the data won't be persisted.
     * @param {boolean} [options.attachXML] - When set to `true`, you will receive the XML invoice in the response.
     * @returns {Promise<Response>} Response
     * @throws {RequestError}
     */
    retrieve(link: string, dateFrom: string, dateTo: string, type: string, options?: {
        token?: string;
        saveData?: boolean;
        attachXML?: boolean;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
