import Resource from './resources';

class Transaction extends Resource {
  #endpoint = 'api/transactions/'

  async retrieve(link, dateFrom, options = {}) {
    const {
      dateTo, token, encryptionKey, saveData,
    } = options;
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
