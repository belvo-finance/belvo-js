export default WidgetToken;
export type Response = import("../types/apiResponses").widgetTokenResponse;
/**
 * @typedef { import("../types/apiResponses").widgetTokenResponse } Response
 */
/**
 * A WidgetToken provides access and refresh keys to allow users to
 * initialize and embed our Connect Widget into their own apps.
 * @extends Resource
 */
declare class WidgetToken extends Resource<any> {
    constructor(session: any);
    /**
     * Request a new token
     * @async
     * @param {object} [options] - Optional parameters (link, scopes, widget customization)
     * @param {string} [options.scopes] - Needed scopes for access_token based on Belvo documentation
     * @param {string} [options.link] - Link ID to be updated (to generate an update access_token)
     * @param {string} [options.widget] - Widget customizations (logo, title, lines, etc)
     * @returns {Promise<Response>} A Promise object returning the accces_token and the refresh_token
     * @throws {RequestError}
     */
    create(options?: {
        scopes?: string;
        link?: string;
        widget?: string;
    }): Promise<Response>;
    #private;
}
import Resource from "./resources";
