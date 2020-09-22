import Resource from './resources';

/**
 * An Income contains a resume of monthly income Transaction in a Link.
 * @extends Resource
 */
class Income extends Resource {
  #endpoint = 'api/incomes/'

  /**
   * Retrieve income information from a specific banking link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} options - Optional parameters (encryptionKey, saveData)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, options = {}) {
    const { encryptionKey, saveData } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      encryption_key: encryptionKey,
      save_data: saveData,
    });
    return result;
  }
}

export default Income;
