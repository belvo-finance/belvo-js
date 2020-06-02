import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Link from '../src/links';

const singleLink = { id: 'ef68519c-8004-4a8d-a74a-2a64c3cdc778', institution: 'banamex_mx_retail', saccess_mode: 'single' };
const recurrentLink = { id: '85946728-96e1-4bd3-9b87-f86f2245b08d', institution: 'banamex_mx_retail', saccess_mode: 'recurrent' };

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

  replyToCreateSingleLinkWithOptions() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          access_mode: 'single',
          username: 'johndoe',
          username2: 'janedoe',
          password: '123asd',
          password2: 'asd123',
          token: 'token123',
          encryption_key: '123pollitoingles',
          username_type: '02',
          certificate: 'dGVzdCBmaWxlCg==',
          private_key: 'dGVzdCBmaWxlCg==',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, singleLink);
  }

  replyToCreateRecurrentLink() {
    this.scope
      .post(
        '/api/links/',
        {
          institution: 'banamex_mx_retail',
          access_mode: 'recurrent',
          username: 'johndoe',
          password: '123asd',
        },
      )
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, singleLink);
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
  mocker.login().replyToCreateSingleLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd');

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can register a link with options', async () => {
  mocker.login().replyToCreateSingleLinkWithOptions();

  const session = await newSession();
  const links = new Link(session);
  const options = {
    username2: 'janedoe',
    password2: 'asd123',
    token: 'token123',
    encryptionKey: '123pollitoingles',
    usernameType: '02',
    certificate: `${__dirname}/test_file.txt`,
    privateKey: `${__dirname}/test_file.txt`,
  };
  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd', options);

  expect(result).toEqual(singleLink);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can register a recurrent link', async () => {
  mocker.login().replyToCreateRecurrentLink();

  const session = await newSession();
  const links = new Link(session);
  const result = await links.register('banamex_mx_retail', 'johndoe', '123asd', { accessMode: Link.RECURRENT });

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
