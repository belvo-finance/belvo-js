/* eslint-disable no-console */

import axios from 'axios';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

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
      await this.session.get('/api/', { auth });
    } catch (error) {
      return false;
    }
    this.session.defaults.auth = auth;
    return true;
  }

  async* getAll(url) {
    const response = await this.session.get(url);

    // eslint-disable-next-line no-restricted-syntax
    for (const item of response.data.results) {
      yield item;
    }

    if (response.data.next) {
      yield* this.getAll(response.data.next);
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
}

export default APISession;
