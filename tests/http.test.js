import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import APISession from '../src/http';
import RequestError from '../src/exceptions';
import Client from '../src/belvo';

class Mocker extends APIMocker {
  addThingsPageOne() {
    this.scope
      .get('/api/things/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, {
        count: 3,
        next: 'https://fake.api/api/things/?page=2',
        previous: null,
        results: [{ one: 1 }],
      });
    return this;
  }

  addThingsPageTwo() {
    this.scope
      .get('/api/things/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .query({ page: 2 })
      .reply(200, {
        count: 3,
        next: 'https://fake.api/api/things/?page=3',
        previous: 'https://fake.api/api/things/?page=1',
        results: [{ two: 2 }],
      });
    return this;
  }

  addThingsPageThree() {
    this.scope
      .get('/api/things/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .query({ page: 3 })
      .reply(200, {
        count: 3,
        next: null,
        previous: 'https://fake.api/api/things/?page=2',
        results: [{ three: 3 }],
      });
    return this;
  }

  replyWithPaginatedThings() {
    this.addThingsPageOne().addThingsPageTwo().addThingsPageThree();
    return this;
  }

  replyToPostThings(replyCode, replyWith) {
    this.scope
      .post('/api/things/', { foo: 'bar' })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(replyCode, replyWith);
    return this;
  }

  replyToDeleteThings(replyCode) {
    this.scope
      .delete('/api/things/666/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(replyCode);
    return this;
  }

  replyToGetThing(replyCode, replyWith = null) {
    this.scope
      .get('/api/things/666/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(replyCode, replyWith);
    return this;
  }

  replyToWrongLogin() {
    this.scope.get('/api/')
      .basicAuth({ user: 'secret-id', pass: 'wrong-password' })
      .reply(401, [{ code: 'unauthorized', detail: 'Invalid credentials' }]);
    return this;
  }
}

const mocker = new Mocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can login', async () => {
  mocker.login();

  const session = await newSession();
  expect(session).toBeTruthy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('incorrect login returns false', async () => {
  mocker.replyToWrongLogin();

  const badSession = new APISession('https://fake.api');
  const login = await badSession.login('secret-id', 'wrong-password');

  expect(login).toBeFalsy();
});

test('belvo client throws an error', async () => {
  mocker.replyToWrongLogin();
  const client = new Client('secret-id', 'wrong-password', 'https://fake.api');
  let error;
  try {
    await client.connect();
  } catch (e) {
    error = e;
  }
  expect(error).toEqual(new Error('Login failed.'));
});

test('getAll() supports pagination', async () => {
  mocker.login().replyWithPaginatedThings();
  const session = await newSession();

  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const r of session.getAll('/api/things/')) {
    result.push(r);
  }

  expect(result).toEqual([{ one: 1 }, { two: 2 }, { three: 3 }]);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('list obeys limit', async () => {
  mocker.login().addThingsPageOne().addThingsPageTwo();
  const scopeUnused = nock('https://fake.api')
    .get('/api/things/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .query({ page: 3 })
    .reply(200, {
      count: 3,
      next: null,
      previous: 'https://fake.api/api/things/?page=2',
      results: [{ three: 3 }],
    });

  const session = await newSession();
  const result = await session.list('/api/things/', 2);

  expect(result).toEqual([{ one: 1 }, { two: 2 }]);
  expect(scopeUnused.isDone()).toBeFalsy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('list without limit gets everything', async () => {
  mocker.login().replyWithPaginatedThings();

  const session = await newSession();
  const result = await session.list('/api/things/');

  expect(result).toEqual([{ one: 1 }, { two: 2 }, { three: 3 }]);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('get by id works ok', async () => {
  mocker.login().replyToGetThing(200, { id: 666, one: 1 });

  const session = await newSession();
  const result = await session.get('/api/things/', 666);

  expect(result).toEqual({ id: 666, one: 1 });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('get handles error', async () => {
  mocker.login().replyToGetThing(404);

  const session = await newSession();
  await expect(session.get('/api/things/', 666))
    .rejects
    .toEqual(new RequestError(404, 'Request failed with status code 404'));
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('post returns map when ok', async () => {
  mocker.login().replyToPostThings(200, { id: 666, foo: 'bar' });

  const session = await newSession();
  const result = await session.post('/api/things/', { foo: 'bar' });

  expect(result).toEqual({ id: 666, foo: 'bar' });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('post handles error ', async () => {
  mocker
    .login()
    .replyToPostThings(400, [
      { code: 'wrong_foo', detail: 'Foo cannot be Bar', field: 'foo' },
    ]);

  const session = await newSession();
  await expect(session.post('/api/things/', { foo: 'bar' }))
    .rejects
    .toEqual(new RequestError(400, 'Request failed with status code 400'));
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('patch returns map when ok', async () => {
  mocker.login();
  mocker.scope
    .patch('/api/things/', { foo: 'bar' })
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, { id: 666, foo: 'bar' });

  const session = await newSession();
  const result = await session.patch('/api/things/', { foo: 'bar' });

  expect(result).toEqual({ id: 666, foo: 'bar' });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('put returns map when ok', async () => {
  mocker.login();
  mocker.scope
    .put('/api/things/666/', { foo: 'bar' })
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, { id: 666, foo: 'bar' });

  const session = await newSession();
  const result = await session.put('/api/things/', 666, { foo: 'bar' });

  expect(result).toEqual({ id: 666, foo: 'bar' });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('delete returns true when ok', async () => {
  mocker.login().replyToDeleteThings(204);

  const session = await newSession();
  const result = await session.delete('/api/things/', 666);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('delete returns false when not ok', async () => {
  mocker.login().replyToDeleteThings(404);

  const session = await newSession();
  const result = await session.delete('/api/things/', 666);

  expect(result).toBeFalsy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('get results by filters', async () => {
  mocker.login();

  const scopeUnused = nock('https://fake.api')
    .get('/api/things/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .query({ foo: 'bar' })
    .reply(200, {
      count: 3,
      next: 'https://fake.api/api/things/?foo=bar&page=2',
      previous: 'https://fake.api/api/things/?foo=bar&page=1',
      results: [{ one: 1 }, { two: 2 }],
    });

  const session = await newSession();
  const result = await session.list('/api/things/', 2, { foo: 'bar' });

  expect(result).toEqual([{ one: 1 }, { two: 2 }]);
  expect(scopeUnused.isDone()).toBeTruthy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('throw exception when environment or url is not provided', async () => {
  expect(
    () => new Client('key-id', 'key-password'),
  ).toThrow('You need to provide a URL or a valid environment.');
});

test.each([
  ['sandbox', 'https://sandbox.belvo.com'],
  ['development', 'https://development.belvo.com'],
  ['production', 'https://api.belvo.com'],
])('belvo client environment %s should be return url %s', async (environment, expected) => {
  const client = new Client('key-id', 'key-password', environment);
  expect(client.session.session.defaults.baseURL).toEqual(expected);
});

test.each([
  ['https://sandbox.belvo.com', 'https://sandbox.belvo.com'],
  ['https://development.belvo.com', 'https://development.belvo.com'],
  ['https://api.belvo.com', 'https://api.belvo.com'],
])('belvo client url argument %s should be return %s', async (url, expected) => {
  const client = new Client('key-id', 'key-password', url);
  expect(client.session.session.defaults.baseURL).toEqual(expected);
});

test.each([
  ['development', 'https://development.belvo.com'],
  ['http://localhost:8000', 'http://localhost:8000'],
])('get BELVO_API_URL from process.env', async (value, expected) => {
  process.env.BELVO_API_URL = value;
  const client = new Client('key-id', 'key-password');
  expect(client.session.session.defaults.baseURL).toEqual(expected);
});
