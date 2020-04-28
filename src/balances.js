import Resource from './resources';

class Balance extends Resource {
  #endpoint = 'api/balances/'

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
