import Resource from './resources';

/**
 * Retrieve tax returns information from a specific fiscal link.
 *
 * @extends Resource
 */
class TaxReturn extends Resource {
  #endpoint = 'api/tax-returns/'

  /**
   * Retrieve tax returns information from a specific fiscal link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {string} yearFrom - Required year from, format is YYYY-MM-DD
   * @param {string} yearTo - Required year to, format is YYYY-MM-DD.
   * @param {object} options - Optional parameters (token, encryptionKey, saveData, attachPDF)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, yearFrom, yearTo, options = {}) {
    const {
      token, encryptionKey, saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      year_from: yearFrom,
      year_to: yearTo,
      encryption_key: encryptionKey,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default TaxReturn;
