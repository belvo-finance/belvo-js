class Resource {
  #endpoint = null;

  constructor(session) {
    this.session = session;
  }

  async list(limit = 100) {
    const result = await this.session.list(this.#endpoint, limit);
    return result;
  }

  async detail(id) {
    const result = await this.session.get(this.#endpoint, id);
    return result;
  }

  async delete(id) {
    const result = await this.session.delete(this.#endpoint, id);
    return result;
  }

  async resume(session, token, link) {
    const result = await this.session.patch(this.#endpoint, { session, token, link });
    return result;
  }
}

export default Resource;
