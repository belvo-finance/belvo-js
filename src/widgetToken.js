import Resource from './resources';

/**
 * A WidgetToken provides access and refresh keys to allow users to
 * initialize and embed our Connect Widget into their own apps.
 * @extends Resource
 */
class WidgetToken extends Resource {
  #endpoint = 'api/token/'

  /**
   * Request a new token
   * @async
   * @param {object} options - Optional parameters (link, scopes)
   * @returns {object} Response
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
