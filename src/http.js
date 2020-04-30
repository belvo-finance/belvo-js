/* eslint-disable no-console */

import axios from 'axios';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RequestError from './exceptions';

/**
 * Perform a request and raise error when status is not 2XX
 * @async
 * @param {function} fn - Function that will perform a request
 * @returns {object} Response
 * @throws {RequestError|Error}
 */
async function raiseForStatus(fn) {
  try {
    const { data } = await fn;
    return data;
  } catch (error) {
    if (error.response) {
      throw new RequestError(error.response.status, error.response.data);
    } else {
      throw error;
    }
  }
}

/** Class representing an active Belvo API session */
class APISession {
  /**
   * Create a session.
   * @param {string} url - Belvo API host URL.
   */
  constructor(url) {
    const version = '0.0.2';
    this.session = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `belvo-js (${version})`,
      },
    });
  }

  /**
   * Login to Belvo API using secret key credentials.
   * @async
   * @param {string} secretKeyId - The Id of the key.
   * @param {string} secretKeyPassword - The password of the key.
   * @returns {boolean} true when login is sucessful else false.
   */
  async login(secretKeyId, secretKeyPassword) {
    const auth = {
      username: secretKeyId,
      password: secretKeyPassword,
    };


    try {
      await raiseForStatus(this.session.get('/api/', { auth }));
    } catch (error) {
      console.log(error);
      return false;
    }
    this.session.defaults.auth = auth;
    return true;
  }

  /**
   * Get all results from a paginated response
   * @async
   * @param {string} url - API endpoint
   * @yields {object} The next result in the response.
   */
  async* getAll(url) {
    const { data: { results, next } } = await this.session.get(url);

    // eslint-disable-next-line no-restricted-syntax
    for (const item of results) {
      yield item;
    }

    if (next) {
      yield* this.getAll(next);
    }
  }

  /**
   * Get a list of resources.
   * @async
   * @param {string} url - API endpoint
   * @param {number} limit - Maximum number of results to get.
   * @returns {array} List of resources.
   */
  async list(url, limit = 100) {
    const results = [];
    const generator = await this.getAll(url);
    for (let index = 0; index < limit; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      const next = await generator.next();
      if (next.done) { break; }
      results.push(next.value);
    }
    return results;
  }

  /**
   * Get details of a specific resource.
   * @async
   * @param {str} url - API endpoint
   * @param {string} id - UUID4 representing the resource id.
   * @returns {object}
   */
  async get(url, id) {
    const response = await raiseForStatus(this.session.get(`${url}${id}/`));
    return response;
  }

  /**
   * Do a POST request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {object} payload - JSON request payload.
   * @returns {object} Response
   * @throws {RequestError}
   */
  async post(url, payload) {
    const response = await raiseForStatus(this.session.post(url, payload));
    return response;
  }

  /**
   * Do a PATCH request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {object} payload - Response
   * @returns {object} Response
   * @throws {RequestError}
   */
  async patch(url, payload) {
    const response = await raiseForStatus(this.session.patch(url, payload));
    return response;
  }

  /**
   * Do a PUT request to the API.
   * @async
   * @param {string} url - API endpoint.
   * @param {string} id - UUID4 representing the resource Id.
   * @param {object} payload - JSON request payload.
   * @throws {RequestError}
   */
  async put(url, id, payload) {
    const composedUrl = `${url}${id}/`;
    const response = await raiseForStatus(this.session.put(composedUrl, payload));
    return response;
  }

  /**
   * Do a DELETE request to the API.
   * @async
   * @param {stroing} url - API endpoint.
   * @param {string} id - UUID4 representing the resource Id.
   * @returns {boolean}
   * @throws {RequestError}
   */
  async delete(url, id) {
    const composedUrl = `${url}${id}/`;
    try {
      await raiseForStatus(this.session.delete(composedUrl));
    } catch (error) {
      return false;
    }
    return true;
  }
}

export default APISession;
