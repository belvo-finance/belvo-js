import Resource from './resources';

/**
 * @typedef { import("../types/apiResponses").taxStatusResponse } Response
 */

/**
 * Retrieve tax status information from a specific fiscal link.
 * @extends Resource<Response>
 */
class TaxStatus extends Resource {
  #endpoint = 'api/tax-status/'

    /** @private */
    resume() {}

  /**
   * Retrieve tax status information from a specific fiscal link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {object} [options] - Optional parameters (`saveData`, `attachPDF`)
   * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to `false`, the data won't be persisted.
   * @param {boolean} [options.attachPDF] - When this is set to `true`, you will receive the PDF as a binary string in the response.
   * @returns {Promise<Response>} Response
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
