import Resource from './resources';

/**
 * Retrieve tax returns information from a specific fiscal link.
 *
 * @extends Resource
 */
class TaxReturn extends Resource {
  #endpoint = 'api/tax-returns/'

  /**
   * @constant {string}
   * @static
   * */
  static YEARLY = 'yearly';

  /**
   * @constant {string}
   * @static
   */
  static MONTHLY = 'monthly';

  /**
   * Retrieve tax returns information from a specific fiscal link.
   *
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {string} yearDateFrom - Required year or date from, format is YYYY-MM-DD
   * @param {string} yearDateTo - Required year or date to, format is YYYY-MM-DD.
   * @param {object} options - Optional parameters (token, saveData, attachPDF)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, yearDateFrom, yearDateTo, options = {}) {
    const {
      token, saveData, attachPDF, type,
    } = options;

    const data = {
      link,
      token,
      save_data: saveData,
      attach_pdf: attachPDF,
      type,
    };

    if (type === TaxReturn.MONTHLY) {
      data.date_from = yearDateFrom;
      data.date_to = yearDateTo;
    } else {
      data.year_from = yearDateFrom;
      data.year_to = yearDateTo;
    }
    const result = await this.session.post(this.#endpoint, data);
    return result;
  }
}

export default TaxReturn;
