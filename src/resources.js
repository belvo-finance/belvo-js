/** Represents a Belvo API resource */
class Resource {
  #endpoint = null;

  /**
   * Instantiate a resource.
   * @param {APISession} session - Belvo API session.
   */
  constructor(session) {
    this.session = session;
  }

  /**
   * Get a list of resources.
   * @async
   * @param {Object} params - Receives two parameters.
   * @param {number} [params.limit=100] - Maximum number of results.
   * @param {Object} [params.filters={}] - Filters to get custom results.
   * @returns {array} List of results.
   * @throws {RequestError}
   */
  async list({ limit = 100, filters = {} } = {}) {
    const result = await this.session.list(this.#endpoint, limit, filters);
    return result;
  }

  /**
   * Get specific record details.
   * @async
   * @param {string} id - UUID4 representation of the resource Id.
   * @returns {object}
   * @throws {RequestError}
   */
  async detail(id) {
    const result = await this.session.get(this.#endpoint, id);
    return result;
  }

  /**
   * Delete specific record.
   * @async
   * @param {string} id - UUID4 representation of the resource Id.
   * @returns {boolean} When the record is successfuly deleted returns true, otherwise false.
   */
  async delete(id) {
    const result = await this.session.delete(this.#endpoint, id);
    return result;
  }

  /**
   * Resume a "pending" session that requires an OTP token.
   * Use this function to resume sessions that returned HTTP 428 status code.
   * @async
   * @param {string} session - UUID4 representation of a "pending" session.
   * @param {string} token - OTP token.
   * @param {string} link - UUID4 representation of the link being used.
   * @returns {object} Response.
   * @throws {RequestError}
   */
  async resume(session, token, link) {
    const result = await this.session.patch(this.#endpoint, { session, token, link });
    return result;
  }
}

export default Resource;
