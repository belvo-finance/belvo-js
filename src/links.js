import Resource from './resources';

class Link extends Resource {
  #endpoint = 'links/';

  static #SINGLE = 'single';

  static #RECURRENT = 'recurrent';

  validateAccessMode() {
    if (!(this.accessMode in [Link.#SINGLE, Link.#RECURRENT])) {
      throw Error('Invalid accessMode given.');
    }
  }

  async register(
    institution, username, password, password2 = null, accessMode = Link.#SINGLE, options = {},
  ) {
    const { token, encryptionKey, usernameType } = options;

    this.validateAccessMode();

    const result = await this.session.post(
      this.#endpoint, {
        institution,
        username,
        password,
        password2,
        token,
        encryption_key: encryptionKey,
        accessMode,
        usernameType,

      },
    );
    return result;
  }

  async update(id, password, password2 = null, options = {}) {
    const { token, encryptionKey } = options;
    const result = await this.session.put(this.#endpoint, id, {
      password, password2, token, encryption_key: encryptionKey,
    });
    return result;
  }
}

export default Link;
