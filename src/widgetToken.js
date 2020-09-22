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
   * @returns {object} Response
   * @throws {RequestError}
   */
  async create() {
    const result = await this.session.post(
      this.#endpoint, {
        id: this.session.keyId,
        password: this.session.keyPassword,
        scopes: 'read_institutions,write_links,read_links,delete_links',
      },
    );
    return result;
  }
}

export default WidgetToken;
