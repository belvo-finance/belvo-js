import Resource from './resources';

class Link extends Resource {
  #endpoint = 'api/links/';

  static SINGLE = 'single';

  static RECURRENT = 'recurrent';

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

  async update(id, password, options = {}) {
    const { token, encryptionKey, password2 } = options;
    const result = await this.session.put(this.#endpoint, id, {
      password, password2, token, encryption_key: encryptionKey,
    });
    return result;
  }
}

export default Link;
