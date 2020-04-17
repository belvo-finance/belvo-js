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
