import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import WidgetToken from '../src/widgetToken';

const token = { foo: 'foo', bar: 'bar' };

class TokenAPIMocker extends APIMocker {
  replyWithAToken() {
    this.scope
      .post('/api/token/', {
        id: 'secret-id',
        password: 'secret-password',
        scopes: 'read_institutions,write_links,read_links,delete_links',
      })
      .reply(200, token);
    return this;
  }
}

const mocker = new TokenAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can get a token', async () => {
  mocker.login().replyWithAToken();

  const session = await newSession();
  const widgetTokenResource = new WidgetToken(session);
  const result = await widgetTokenResource.create();

  expect(result).toEqual(token);
});
