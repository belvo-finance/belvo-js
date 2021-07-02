import Resource from './resources';

/**
 * A Statement contains a resume of monthly Transactions inside an Account.
 * @extends Resource
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
   * @param {object} options - Optional parameters (token, saveData, attachPDF)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, account, year, month, options = {}) {
    const {
      token, saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      account,
      year,
      month,
      token,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default Statement;
