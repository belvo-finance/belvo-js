import Resource from './resources';

/**
 * A Link is a set of credentials associated to a end-user access to an Institution.
 * @extends Resource
 * */
class Link extends Resource {
  /**
   * Links endpoint.
   * @private
   */
  #endpoint = 'api/links/';

  /**
   * @constant {string}
   * @static
   * */
  static SINGLE = 'single';

  /**
   * @constant {string}
   * @static
   */
  static RECURRENT = 'recurrent';

  /**
   * Register a new link.
   * @async
   * @param {string} institution - Institution's code.
   * @param {string} username - Username used to sign in online by the end-user.
   * @param {string} password - Password used to sign in online by the end-user.
   * @param {object} options - Optional parameters
   *   (token, encriptionKey, usernameType, password2, accessMode).
   * @returns {object} Newly created link.
   * @throws {RequestError}
   */
  async register(
    institution, username, password, options = {},
  ) {
    const {
      token, encryptionKey, usernameType, password2, accessMode,
    } = options;

    const result = await this.session.post(
      this.#endpoint, {
        institution,
        username,
        password,
        password2,
        token,
        encryption_key: encryptionKey,
        access_mode: accessMode ?? Link.SINGLE,
        username_type: usernameType,

      },
    );
    return result;
  }

  /**
   * Update link's password and password2.
   * Use this function when you want to update the link credentials.
   * Only updating passwords is available.
   * @async
   * @param {string} id - UUID4 representation of the link Id.
   * @param {string} password - New password.
   * @param {object} options - Optional parameters (token, encryptionKey, password2).
   * @returns {object} Response
   * @throws {RequestError}
   */
  async update(id, password, options = {}) {
    const { token, encryptionKey, password2 } = options;
    const result = await this.session.put(this.#endpoint, id, {
      password, password2, token, encryption_key: encryptionKey,
    });
    return result;
  }
}

export default Link;
