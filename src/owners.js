import Resource from './resources';

/**
 * An Owner represents the person who has access to a Link and
 * is the owner of all the Accounts inside the Link.
 *
 * @extends Resource
 */
class Owner extends Resource {
  #endpoint = 'api/owners/'

  /**
   * Retrieve owner information from a specific link.
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} options - Optional parameters (token, saveData)
   * @returns {object} - Response
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

export default Owner;
