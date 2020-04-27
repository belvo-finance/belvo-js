import nock from 'nock';
import APISession from '../src/http';


class APIMocker {
  constructor(url) {
    this.scope = nock(url, {
      reqheaders: {
        'user-agent': (headerValue) => headerValue.includes('belvo-js'),
      },
    });
  }

  login() {
    this.scope.get('/api/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200);
    return this;
  }
}

const newSession = async () => {
  const apiSession = new APISession('https://fake.api');
  await apiSession.login('secret-id', 'secret-password');
  return apiSession;
};

export { APIMocker, newSession };
