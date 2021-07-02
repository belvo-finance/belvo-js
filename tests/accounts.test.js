import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Account from '../src/accounts';

const account = {
  type: 'Cuentas de efectivo',
  number: '00004057068115181',
  collected_at: '2019-09-27T13:01:41.941Z',
  bank_product_id: '66',
  balance: {
    current: 5874.13,
    available: 5621.12,
  },
  link: '30cb4806-6e00-48a4-91c9-ca55968576c8',
  internal_identification: '2',
  public_identification_name: 'CLABE',
  public_identification_value: '123',
  institution: {
    name: 'banamex',
    type: 'bank',
  },
  credit_data: {
    credit_limit: 192000,
    collected_at: '2019-09-27T13:01:41.941Z',
    cutting_date: '2019-12-11',
    end_date: '2019-12-13',
    minimum_payment: 2400,
    monthly_payment: 1000,
    no_interest_payment: 37390.83,
    last_payment_date: '2019-10-28',
    last_period_balance: 37390.83,
    interest_rate: 4.02,
  },
  loan_data: {
    credit_limit: 192000,
    collected_at: '2019-09-27T13:01:41.941Z',
    cutting_day: '17',
    cutting_date: '2019-12-17',
    limit_day: '27',
    monthly_payment: 1000,
    no_interest_payment: 37390.83,
    last_payment_date: '2019-10-28',
    last_period_balance: 37390.83,
    interest_rate: 4.02,
  },
  name: 'Cuenta Perfiles- M.N. - MXN-666',
  category: 'CHECKING_ACCOUNT',
  currency: 'MXN',
  id: '0d3ffb69-f83b-456e-ad8e-208d0998d71d',
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class AccountsAPIMocker extends APIMocker {
  replyWithListOfAccounts() {
    this.scope
      .get('/api/accounts/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [account],
        },
      );
    return this;
  }

  replyToAccountsDetail() {
    this.scope
      .get(`/api/accounts/${account.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, account);
  }

  replyToDeleteAccount() {
    this.scope
      .delete(`/api/accounts/${account.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateAccount() {
    this.scope
      .post('/api/accounts/', { link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, account);
  }

  replyToCreateaccountWithOptions() {
    this.scope
      .post('/api/accounts/', {
        link: linkId, save_data: false, token: 'token123',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, account);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/accounts/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, account);
  }
}

const mocker = new AccountsAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list accounts', async () => {
  mocker.login().replyWithListOfAccounts();

  const session = await newSession();
  const accounts = new Account(session);
  const result = await accounts.list();

  expect(result).toEqual([account]);
});

test('can retrieve accounts', async () => {
  mocker.login().replyToCreateAccount();

  const session = await newSession();
  const accounts = new Account(session);
  const result = await accounts.retrieve(linkId);

  expect(result).toEqual(account);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve accounts with options', async () => {
  mocker.login().replyToCreateaccountWithOptions();

  const session = await newSession();
  const accounts = new Account(session);
  const options = {
    token: 'token123',
    saveData: false,
  };
  const result = await accounts.retrieve(linkId, options);

  expect(result).toEqual(account);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see account detail', async () => {
  mocker.login().replyToAccountsDetail();

  const session = await newSession();
  const accounts = new Account(session);
  const result = await accounts.detail(account.id);

  expect(result).toEqual(account);
});

test('can delete account', async () => {
  mocker.login().replyToDeleteAccount();

  const session = await newSession();
  const accounts = new Account(session);
  const result = await accounts.delete(account.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume account session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const accounts = new Account(session);
  const result = await accounts.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(account);
  expect(mocker.scope.isDone()).toBeTruthy();
});
