/* eslint-disable no-console */

import { create } from 'axios';

class APISession {
  constructor(url) {
    this.url = url;
    this.session = create({
      baseURL: this.url,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'belvo-js ({})'.format('0.0.1'),
      },
    });
  }

  login(secretKeyId, secretKeyPassword) {
    const auth = {
      username: secretKeyId,
      password: secretKeyPassword,
    };

    this.session.get('/api/', { auth })
      .catch((error) => {
        console.log(error.response.status);
        console.log(error.response.data);
        return false;
      });

    this.session.defaults.auth = auth;
    return true;
  }
}

export default APISession;
