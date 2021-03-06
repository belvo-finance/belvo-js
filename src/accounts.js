import Resource from './resources';

/**
 * An Account is the representation of a bank account inside a financial institution.
 * @extends Resource
 */
class Account extends Resource {
  #endpoint = 'api/accounts/'

  /**
   * Retrieve accounts from an existing link.
   * @async
   * @param {string} link UUID4 representation of a Link Id.
   * @param {object} options - Optional parameters (token, saveData)
   * @return {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, options = {}) {
    const { token, saveData } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      save_data: saveData,
    });
    return result;
  }
}

export default Account;
