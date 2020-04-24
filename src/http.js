/* eslint-disable no-console */

import axios from 'axios';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RequestError from './exceptions';


async function raiseForStatus(fn) {
  try {
    const { data } = await fn;
    return data;
  } catch (error) {
    throw new RequestError(error.response.status, error.response.data);
  }
}

class APISession {
  constructor(url) {
    const version = '0.0.1';
    this.session = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `belvo-js (${version})`,
      },
    });
  }

  async login(secretKeyId, secretKeyPassword) {
    const auth = {
      username: secretKeyId,
      password: secretKeyPassword,
    };


    try {
      await raiseForStatus(this.session.get('/api/', { auth }));
    } catch (error) {
      return false;
    }
    this.session.defaults.auth = auth;
    return true;
  }

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

  async get(url, id) {
    const response = await raiseForStatus(this.session.get(`${url}${id}/`));
    return response;
  }

  async post(url, payload) {
    const response = await raiseForStatus(this.session.post(url, payload));
    return response;
  }

  async patch(url, payload) {
    const response = await raiseForStatus(this.session.patch(url, payload));
    return response;
  }

  async put(url, id, payload) {
    const composedUrl = `${url}${id}/`;
    const response = await raiseForStatus(this.session.put(composedUrl, payload));
    return response;
  }

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
