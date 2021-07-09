import nock from 'nock';
import moment from 'moment';
import { APIMocker, newSession } from './fixtures';
import Balance from '../src/balances';

const balance = {
  id: '076c66e5-90f5-4e01-99c7-50e32f65ae42',
  account: {
    name: 'Cuenta Perfiles- M.N. - MXN-666',
    category: 'CHECKING_ACCOUNT',
    currency: 'MXN',
    id: '0d3ffb69-f83b-456e-ad8e-208d0998d71d',
  },
  collected_at: '2019-11-28T10:27:44.813Z',
  value_date: '2019-10-23T00:00:00.000Z',
  current_balance: 2145.45,
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class BalancesAPIMocker extends APIMocker {
  replyWithListOfBalances() {
    this.scope
      .get('/api/balances/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [balance],
        },
      );
    return this;
  }

  replyToBalancesDetail() {
    this.scope
      .get(`/api/balances/${balance.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, balance);
  }

  replyToDeleteBalance() {
    this.scope
      .delete(`/api/balances/${balance.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateBalance() {
    this.scope
      .post('/api/balances/', { link: linkId, date_from: '2019-10-20', date_to: moment().format('YYYY-MM-DD') })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, balance);
  }

  replyToCreateBalanceWithOptions() {
    this.scope
      .post('/api/balances/', {
        link: linkId,
        date_from: '2019-10-20',
        date_to: '2019-12-01',
        save_data: false,
        token: 'token123',
        account: '0d3ffb69-f83b-456e-ad8e-208d0998d71d',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, balance);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/balances/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, balance);
  }
}

const mocker = new BalancesAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list balances', async () => {
  mocker.login().replyWithListOfBalances();

  const session = await newSession();
  const balances = new Balance(session);
  const result = await balances.list();

  expect(result).toEqual([balance]);
});

test('can retrieve balances', async () => {
  mocker.login().replyToCreateBalance();

  const session = await newSession();
  const balances = new Balance(session);
  const result = await balances.retrieve(linkId, '2019-10-20');

  expect(result).toEqual(balance);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve balances with options', async () => {
  mocker.login().replyToCreateBalanceWithOptions();

  const session = await newSession();
  const balances = new Balance(session);
  const options = {
    account: '0d3ffb69-f83b-456e-ad8e-208d0998d71d',
    dateTo: '2019-12-01',
    token: 'token123',
    saveData: false,
  };
  const result = await balances.retrieve(linkId, '2019-10-20', options);

  expect(result).toEqual(balance);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see balance detail', async () => {
  mocker.login().replyToBalancesDetail();

  const session = await newSession();
  const balances = new Balance(session);
  const result = await balances.detail(balance.id);

  expect(result).toEqual(balance);
});

test('can delete balance', async () => {
  mocker.login().replyToDeleteBalance();

  const session = await newSession();
  const balances = new Balance(session);
  const result = await balances.delete(balance.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume balance session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const balances = new Balance(session);
  const result = await balances.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(balance);
  expect(mocker.scope.isDone()).toBeTruthy();
});
