import Resource from './resources';

/**
 * @typedef { import("../types/apiResponses").incomesResponse } Response
 */

/**
 * An Income contains a resume of monthly income Transaction in a Link.
 * @extends Resource<Response>
 */
class Income extends Resource {
  #endpoint = 'api/incomes/'

  /**
   * Retrieve income information from a specific banking link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} [options] - Optional parameters (saveData)
   * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to false, the data won't be persisted.
   * @returns {Promise<Response>} Response
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
