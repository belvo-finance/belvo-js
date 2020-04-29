import Resource from './resources';

/**
 * A Balance represents the financial status of an Account at a given time.
 * @extends Resource
 */
class Balance extends Resource {
  #endpoint = 'api/balances/'

  /**
   * Retrieve balances from a specific account or all accounts from a specific link.
   * @async
   * @param {string} link - UUID4 representation of a link Id.
   * @param {string} dateFrom - Required date from, format is YYYY-MM-DD
   * @param {object} options - Optional parameters (account, dateTo, token, encryptionKey, saveData)
   * @return {object} Response
   * @throws {RequestError}
   */
  async retrieve(link, dateFrom, options = {}) {
    const {
      account, dateTo, token, encryptionKey, saveData,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      account,
      date_from: dateFrom,
      date_to: dateTo,
      encryption_key: encryptionKey,
      save_data: saveData,
    });
    return result;
  }
}

export default Balance;
