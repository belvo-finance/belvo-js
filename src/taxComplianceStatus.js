import Resource from './resources';

/**
 * Retrieve tax compliance status information from a specific fiscal link.
 *
 * @extends Resource
 */
class TaxComplianceStatus extends Resource {
  #endpoint = 'api/tax-compliance-status/'

  /**
   * Retrieve tax compliance status information from a specific fiscal link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} options - Optional parameters ( saveData, attachPDF)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, options = {}) {
    const {
      saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default TaxComplianceStatus;
