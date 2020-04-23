import 'core-js/stable';
import 'regenerator-runtime/runtime';
import nock from 'nock';
import APISession from './http';
import RequestError from './exceptions';

test('can login', async () => {
  const scope = nock('https://fake.api', {
    reqheaders: {
      'user-agent': (headerValue) => headerValue.includes('belvo-js'),
    },
  })
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200);

  const session = new APISession('https://fake.api');
  const login = await session.login('secret-id', 'secret-password');
  scope.isDone();
  expect(login).toBeTruthy();
});

test('incorrect login returns false', async () => {
  nock('https://fake.api', {
    reqheaders: {
      'user-agent': (headerValue) => headerValue.includes('belvo-js'),
    },
  })
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' });

  const session = new APISession('https://fake.api');
  const login = await session.login('secret-id', 'wrong-password');
  expect(login).toBeFalsy();
});

test('getAll() supports pagination', async () => {
  nock('https://fake.api')
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200)
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

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const r of session.getAll('/api/things/')) {
    result.push(r);
  }
  expect(result.length).toBe(3);
  expect(result).toEqual([{ one: 1 }, { two: 2 }, { three: 3 }]);
});

test('list obeys limit', async () => {
  nock('https://fake.api')
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200)
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

  const scope = nock('https://fake.api')
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
  expect(scope.isDone()).toBeFalsy();
});


test('get by id works ok', async () => {
  const scope = nock('https://fake.api')
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200)
    .get('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, { id: 666, one: 1 });

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  const result = await session.get('/api/things/', 666);

  expect(result).toEqual({ id: 666, one: 1 });
  expect(scope.isDone()).toBeTruthy();
});


test('get handles error', async () => {
  const scope = nock('https://fake.api')
    .get('/api/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200)
    .get('/api/things/666/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(404);

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');

  await expect(session.get('/api/things/', 666))
    .rejects
    .toEqual(new RequestError(404, 'Request failed with status code 404'));
  expect(scope.isDone()).toBeTruthy();
});
