import Resource from './resources';

/**
 * An Invoice is the representation of an electronic invoice,
 * that can be received or sent, by a business or an individual
 * and has been uploaded to the fiscal institution website.
 *
 * @extends Resource
 */
class Invoice extends Resource {
  #endpoint = 'api/invoices/'

  /**
   * Retrieve invoices information from a specific fiscal link.
   * You can ask for a maximum of 1 year of invoices per request,
   * if you need more you need to do multiple requests.
   *
   * @async
   * @param {string} link UUID4 representation of a link Id.
   * @param {string} dateFrom - Required date from, format is YYYY-MM-DD.
   * @param {string} dateTo - Required date to, format is YYYY-MM-DD.
   * @param {string} type - Required type, it can be 'INFLOW' or 'OUTFLOW'.
   * @param {object} options - Optional parameters (token, saveData, attachXML)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, dateFrom, dateTo, type, options = {}) {
    const {
      token, saveData, attachXML,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      date_from: dateFrom,
      date_to: dateTo,
      type,
      save_data: saveData,
      attach_xml: attachXML,
    });
    return result;
  }
}

export default Invoice;
