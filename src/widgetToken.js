import Resource from './resources';

/**
 * A WidgetToken provides access and refresh keys to allow users to
 * initialize and embed our Connect Widget into their own apps.
 * @typedef { import("../types/apiResponses").widgetTokenResponse } Response
 * @extends Resource
 */

class WidgetToken extends Resource {
  #endpoint = 'api/token/'

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
  async create(options = {}) {
    let { scopes } = options;
    const { link } = options;
    const { widget } = options;
    scopes = scopes || 'read_institutions,write_links,read_links';
    const result = await this.session.post(
      this.#endpoint, {
        id: this.session.keyId,
        password: this.session.keyPassword,
        link_id: link,
        scopes,
        widget,
      },
    );
    return result;
  }
}

export default WidgetToken;
