import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Link from '../src/links';

const singleLink = { id: 'ef68519c-8004-4a8d-a74a-2a64c3cdc778', institution: 'banamex_mx_retail', saccess_mode: 'single' };
const recurrentLink = { id: '85946728-96e1-4bd3-9b87-f86f2245b08d', institution: 'banamex_mx_retail', saccess_mode: 'recurrent' };
const tokenResponse = { refresh: '23456', access: 'abcdef' };

class LinksAPIMocker extends APIMocker {
  replyWithListOfLinks() {
    this.scope
      .get('/api/links/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 2,
          next: null,
          previous: null,
          results: [singleLink, recurrentLink],
        },
      );
    return this;
  }

  replyWithASingleLink() {
    this.scope
      .get(`/api/links/${singleLink.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, singleLink);
  }

  replyToDeleteSingleLink() {
    this.scope
      .delete(`/api/links/${singleLink.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateSingleLink() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          access_mode: 'single',
          username: 'johndoe',
          password: '123asd',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, singleLink);
  }

  replyToUpdateAccessMode() {
    this.scope
      .patch(
        `/api/links/${singleLink.id}/`,
        {
          access_mode: 'single',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, singleLink);
  }

  replyToCreateRecurrentLinkWithOptions() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          username: 'johndoe',
          username2: 'janedoe',
          username3: 'foo',
          password: '123asd',
          password2: 'asd123',
          token: 'token123',
          username_type: '02',
          certificate: 'dGVzdCBmaWxlCg==',
          private_key: 'dGVzdCBmaWxlCg==',
          external_id: 'abc',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, recurrentLink);
  }

  replyToCreateRecurrentLinkWithEmptyCertificate() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          username: 'johndoe',
          username2: 'janedoe',
          username3: 'foo',
          password: '123asd',
          password2: 'asd123',
          token: 'token123',
          username_type: '02',
          certificate: null,
          private_key: null,
          external_id: 'abc',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, recurrentLink);
  }

  replyToCreateRecurrentLink() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          username: 'johndoe',
          password: '123asd',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, recurrentLink);
  }

  replyToUpdateLink() {
    this.scope
      .put(`/api/links/${singleLink.id}/`, { password: 'new-password' })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, singleLink);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/links/', { session: 'abc123', token: 'my-token', link: singleLink.id })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, singleLink);
  }

  replyToLinkToken() {
    this.scope
      .post('/api/token/', { scopes: 'read_links', link_id: singleLink.id })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, tokenResponse);
  }

  replyWithFilters(filters = {}) {
    this.scope
      .get('/api/links/')
      .query(filters)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, {
        count: 10,
        next: null,
        previous: null,
        results: [singleLink],
      });
  }
}

const mocker = new LinksAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list links', async () => {
  mocker.login().replyWithListOfLinks();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.list();

  expect(result).toEqual([singleLink, recurrentLink]);
});

test('can register a link', async () => {
  mocker.login().replyToCreateRecurrentLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd');

  expect(result).toEqual(recurrentLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can register a link with options', async () => {
  mocker.login().replyToCreateRecurrentLinkWithOptions();

  const session = await newSession();
  const links = new Link(session);

  const options = {
    username2: 'janedoe',
    username3: 'foo',
    password2: 'asd123',
    token: 'token123',
    usernameType: '02',
    certificate: `${__dirname}/test_file.txt`,
    privateKey: `${__dirname}/test_file.txt`,
    externalId: 'abc',
  };

  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd', options);

  expect(result).toEqual(recurrentLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can register a single link', async () => {
  mocker.login().replyToCreateSingleLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd', { accessMode: Link.SINGLE });

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see link detail', async () => {
  mocker.login().replyWithASingleLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.detail(singleLink.id);

  expect(result).toEqual(singleLink);
});

test('can update link', async () => {
  mocker.login().replyToUpdateLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.update(singleLink.id, { password: 'new-password' });

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can delete link', async () => {
  mocker.login().replyToDeleteSingleLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.delete(singleLink.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume link session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.resume('abc123', 'my-token', singleLink.id);

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can request token with scopes', async () => {
  mocker.login().replyToLinkToken();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.token(singleLink.id, 'read_links');

  expect(result).toEqual(tokenResponse);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can list link given filter external_id', async () => {
  const filters = { external_id__in: 'abc,efd3' };
  mocker.login().replyWithFilters(filters);

  const session = await newSession();
  const links = new Link(session);
  const results = await links.list({ filters });

  expect(results).toEqual([singleLink]);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can patch link access_mode', async () => {
  mocker.login().replyToUpdateAccessMode();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.patch(singleLink.id, { accessMode: Link.SINGLE });

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('cant register a link with options and empty certificate ', async () => {
  mocker.login().replyToCreateRecurrentLinkWithEmptyCertificate();

  const session = await newSession();
  const links = new Link(session);

  const options = {
    username2: 'janedoe',
    username3: 'foo',
    password2: 'asd123',
    token: 'token123',
    usernameType: '02',
    certificate: `${__dirname}/dont_exist.txt`,
    privateKey: `${__dirname}/dont_exist.txt`,
    externalId: 'abc',
  };

  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd', options);
  expect(result).toEqual(recurrentLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});
