import 'core-js/stable';
import 'regenerator-runtime/runtime';
import nock from 'nock';
import APISession from './http';

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

test('list supports pagination', async () => {
  nock('https://fake.api')
    .get('/api/things/')
    .basicAuth({ user: 'secret-id', pass: 'secret-password' })
    .reply(200, {
      count: 3,
      next: 'https://fake.api/api/things/?page=2',
      previous: null,
      results: [{ one: 1 }],
    })
    .get('/api/things/')
    .query({ page: 2 })
    .reply(200, {
      count: 3,
      next: 'https://fake.api/api/things/?page=3',
      previous: 'https://fake.api/api/things/?page=1',
      results: [{ two: 2 }],
    })
    .get('/api/things/')
    .query({ page: 3 })
    .reply(200, {
      count: 3,
      next: null,
      previous: 'https://fake.api/api/things/?page=2',
      results: [{ three: 3 }],
    });

  const session = new APISession('https://fake.api');
  await session.login('secret-id', 'secret-password');
  const listOfThings = session.list('/api/things/');

  expect(listOfThings.length).toBe(3);
  expect(listOfThings).toBe([{ one: 1 }, { two: 2 }, { three: 3 }]);
});
