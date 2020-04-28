import Resource from './resources';

class Invoice extends Resource {
  #endpoint = 'api/invoices/'

  async retrieve(link, dateFrom, dateTo, options = {}) {
    const {
      token, encryptionKey, saveData, attachXML,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      date_from: dateFrom,
      date_to: dateTo,
      encryption_key: encryptionKey,
      save_data: saveData,
      attach_xml: attachXML,
    });
    return result;
  }
}

export default Invoice;
