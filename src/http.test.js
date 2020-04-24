import nock from 'nock';
import APISession from './http';
import RequestError from './exceptions';


class Mocker {
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

  paginatedThings() {
    this.scope
      .get('/api/things/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, {
        count: 3,
        next: 'https://fake.api/api/things/?page=2',
        previous: null,
        results: [{ one: 1 }],
      })
      .get('/api/things/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .query({ page: 2 })
      .reply(200, {
        count: 3,
        next: 'https://fake.api/api/things/?page=3',
        previous: 'https://fake.api/api/things/?page=1',
        results: [{ two: 2 }],
      })
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
}

const mocker = new Mocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can login', async () => {
  mocker.login();

  const session = new APISession('https://fake.api');
  const login = await session.login('secret-id', 'secret-password');

  expect(mocker.scope.isDone()).toBeTruthy();
  expect(login).toBeTruthy();
});

test('incorrect login returns false', async () => {
  mocker.login();

  const session = new APISession('https://fake.api');
  const login = await session.login('secret-id', 'wrong-password');

  expect(login).toBeFalsy();
});

test('getAll() supports pagination', async () => {
  mocker.login().paginatedThings();

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const r of session.getAll('/api/things/')) {
    result.push(r);
  }

  expect(result).toEqual([{ one: 1 }, { two: 2 }, { three: 3 }]);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('list obeys limit', async () => {
  mocker.login();
  mocker.scope
    .get('/api/things/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, {
      count: 3,
      next: 'https://fake.api/api/things/?page=2',
      previous: null,
      results: [{ one: 1 }],
    })
    .get('/api/things/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .query({ page: 2 })
    .reply(200, {
      count: 3,
      next: 'https://fake.api/api/things/?page=3',
      previous: 'https://fake.api/api/things/?page=1',
      results: [{ two: 2 }],
    });

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

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.list('/api/things/', 2);

  expect(result).toEqual([{ one: 1 }, { two: 2 }]);
  expect(scopeUnused.isDone()).toBeFalsy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('list without limit gets everything', async () => {
  mocker.login().paginatedThings();

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');
  const result = await session.list('/api/things/');

  expect(result).toEqual([{ one: 1 }, { two: 2 }, { three: 3 }]);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('get by id works ok', async () => {
  mocker.login();
  mocker.scope
    .get('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, { id: 666, one: 1 });

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.get('/api/things/', 666);

  expect(result).toEqual({ id: 666, one: 1 });
  expect(mocker.scope.isDone()).toBeTruthy();
});


test('get handles error', async () => {
  mocker.login();
  mocker.scope
    .get('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(404);

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  await expect(session.get('/api/things/', 666))
    .rejects
    .toEqual(new RequestError(404, 'Request failed with status code 404'));
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('post returns map when ok', async () => {
  mocker.login();
  mocker.scope
    .post('/api/things/', { foo: 'bar' })
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, { id: 666, foo: 'bar' });

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.post('/api/things/', { foo: 'bar' });

  expect(result).toEqual({ id: 666, foo: 'bar' });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('post handles error ', async () => {
  mocker.login();
  mocker.scope
    .post('/api/things/', { foo: 'bar' })
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(400, [{ code: 'wrong_foo', detail: 'Foo cannot be Bar', field: 'foo' }]);

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

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

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

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

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.put('/api/things/', 666, { foo: 'bar' });

  expect(result).toEqual({ id: 666, foo: 'bar' });
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('delete returns true when ok', async () => {
  mocker.login();
  mocker.scope
    .delete('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(204);

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');
  const result = await session.delete('/api/things/', 666);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('delete returns false when not ok', async () => {
  mocker.login();
  mocker.scope
    .delete('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(404);

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.delete('/api/things/', 666);

  expect(result).toBeFalsy();
  expect(mocker.scope.isDone()).toBeTruthy();
});
