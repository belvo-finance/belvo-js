import moment from 'moment';
import Resource from './resources';

/**
 * A Transaction contains the detailed information of each movement inside an Account.
 * @extends Resource
 */
class Transaction extends Resource {
  #endpoint = 'api/transactions/'

  /**
   * Retrieve transactions from a specific account or all accounts from a specific link.
   * @async
   * @param {string} link - UUID4 representation of a Link Id.
   * @param {string} dateFrom - Required date from, format is YYYY-MM-DD.
   * @param {object} options - Optional parameters (dateTo, token, encryptionKey, saveData)
   * @returns {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, dateFrom, options = {}) {
    const {
      token, encryptionKey, saveData,
    } = options;
    let {
      dateTo,
    } = options;
    if (!dateTo) {
      dateTo = moment().format('YYYY-MM-DD');
    }
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      date_from: dateFrom,
      date_to: dateTo,
      encryption_key: encryptionKey,
      save_data: saveData,
    });
    return result;
  }
}

export default Transaction;
