import APISession from './http';

class Client {
  constructor(secretKeyId, secretKeyPassword, url = null) {
    this.session = APISession(url);
    if (!this.session.login(secretKeyId, secretKeyPassword)) {
      throw new Error('Login failed.');
    }
  }
}

export default Client;
