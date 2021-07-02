import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Owner from '../src/owners';

const owner = {
  id: 'c749315b-eec2-435d-a458-06912878564f',
  display_name: 'John Doe',
  first_name: 'John',
  last_name: 'Doe',
  second_last_name: 'Smith',
  phone_number: '+52-XXX-XXX-XXXX',
  email: 'johndoe@belvo.com',
  address: 'Carrer de la Llacuna, 162, 08018 Barcelona',
  collected_at: '2019-09-27T13:01:41.941Z',
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class OwnersAPIMocker extends APIMocker {
  replyWithListOfowners() {
    this.scope
      .get('/api/owners/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [owner],
        },
      );
    return this;
  }

  replyToOwnersDetail() {
    this.scope
      .get(`/api/owners/${owner.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, owner);
  }

  replyToDeleteOwner() {
    this.scope
      .delete(`/api/owners/${owner.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateOwner() {
    this.scope
      .post('/api/owners/', { link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, owner);
  }

  replyToCreateOwnerWithOptions() {
    this.scope
      .post('/api/owners/', {
        link: linkId, save_data: false, token: 'token123',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, owner);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/owners/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, owner);
  }
}

const mocker = new OwnersAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list owners', async () => {
  mocker.login().replyWithListOfowners();

  const session = await newSession();
  const owners = new Owner(session);
  const result = await owners.list();

  expect(result).toEqual([owner]);
});

test('can retrieve owners', async () => {
  mocker.login().replyToCreateOwner();

  const session = await newSession();
  const owners = new Owner(session);
  const result = await owners.retrieve(linkId);

  expect(result).toEqual(owner);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve owners with options', async () => {
  mocker.login().replyToCreateOwnerWithOptions();

  const session = await newSession();
  const owners = new Owner(session);
  const options = {
    token: 'token123',
    saveData: false,
  };
  const result = await owners.retrieve(linkId, options);

  expect(result).toEqual(owner);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see owner detail', async () => {
  mocker.login().replyToOwnersDetail();

  const session = await newSession();
  const owners = new Owner(session);
  const result = await owners.detail(owner.id);

  expect(result).toEqual(owner);
});

test('can delete owner', async () => {
  mocker.login().replyToDeleteOwner();

  const session = await newSession();
  const owners = new Owner(session);
  const result = await owners.delete(owner.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume owner session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const owners = new Owner(session);
  const result = await owners.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(owner);
  expect(mocker.scope.isDone()).toBeTruthy();
});
