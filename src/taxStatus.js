import Resource from './resources';

/**
 * Retrieve tax status information from a specific fiscal link.
 *
 * @extends Resource
 */
class TaxStatus extends Resource {
  #endpoint = 'api/tax-status/'

  /**
   * Retrieve tax status information from a specific fiscal link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} options - Optional parameters ( encryptionKey, saveData, attachPDF)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, options = {}) {
    const {
      encryptionKey, saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      encryption_key: encryptionKey,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default TaxStatus;
