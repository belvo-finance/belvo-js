import Resource from './resources';

class TaxReturn extends Resource {
  #endpoint = 'api/tax-returns/'

  async retrieve(link, yearFrom, yearTo, options = {}) {
    const {
      token, encryptionKey, saveData, attachPDF,
    } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      year_from: yearFrom,
      year_to: yearTo,
      encryption_key: encryptionKey,
      save_data: saveData,
      attach_pdf: attachPDF,
    });
    return result;
  }
}

export default TaxReturn;
