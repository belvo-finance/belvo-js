import Resource from './resources';

class Owner extends Resource {
  #endpoint = 'api/owners/'

  async retrieve(link, options = {}) {
    const { token, encryptionKey, saveData } = options;
    const result = await this.session.post(this.#endpoint, {
      link,
      token,
      encryption_key: encryptionKey,
      save_data: saveData,
    });
    return result;
  }
}

export default Owner;
