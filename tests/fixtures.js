import nock from 'nock';


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

export default APIMocker;
