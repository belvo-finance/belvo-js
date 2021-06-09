export default Account;
export type Response = import("../types/apiResponses").accountsResponse;
/**
 * @typedef { import("../types/apiResponses").accountsResponse } Response
 */
/**
 * An Account is the representation of a bank account inside a financial institution.
 * @extends Resource<Response>
 */
declare class Account extends Resource<import("../types/apiResponses").accountsResponse> {
    constructor(session: any);
    /**
     * Retrieve accounts from an existing link.
     * @async
     * @param {string} link UUID4 representation of a Link Id.
     * @param {object} [options] - Optional parameters (token, saveData)
     * @param {string} [options.token] - The OTP token generated by the bank.
     * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to false, the data won't be persisted.
     * @returns {Promise<Response>} Response
     * @throws {RequestError}
     */
    retrieve(link: string, options?: {
        token?: string;
        saveData?: boolean;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
