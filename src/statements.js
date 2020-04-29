import Resource from './resources';

class Statement extends Resource {
  #endpoint = 'api/statements/'

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
