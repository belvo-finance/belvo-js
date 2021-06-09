import Resource from './resources';

/**
 * A Statement contains a resume of monthly Transactions inside an Account.
 * @typedef { import("../types/apiResponses").statementsResponse } Response
 * @extends Resource<Response>
 */
class Statement extends Resource {
  #endpoint = 'api/statements/'

  /**
   * Retrieve statements information from a specific banking link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {string} account - UUID4 representation of an account Id.
   * @param {number} year - The year you want to retrieve.
   * @param {number} month - The month you want to retrieve.
   * @param {object} [options] - Optional parameters (`token`, `saveData`, `attachPDF`)
   * @param {string} [options.token] - The OTP token generated by the bank.
   * @param {boolean} [options.saveData] - Indicates whether or not to persist the data in Belvo. When set to `false`, the data won't be persisted.
   * @param {boolean} [options.attachPDF] - When this is set to `true`, you will receive the PDF as a binary string in the response.
   * @returns {Promise<Response>} Response
   * @throws {RequestError}
   */
  async retrieve(link, account, year, month, options = {}) {
    const {
      token, encryptionKey, saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      account,
      year,
      month,
      token,
      encryption_key: encryptionKey,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default Statement;
