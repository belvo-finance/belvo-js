import nock from 'nock';
import moment from 'moment';
import { APIMocker, newSession } from './fixtures';
import Transaction from '../src/transactions';

const transaction = {
  id: '076c66e5-90f5-4e01-99c7-50e32f65ae42',
  account: {
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
    public_identification_value: '00314057068115181',
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
  },
  collected_at: '2019-11-28T10:27:44.813Z',
  value_date: '2019-10-23T00:00:00.000Z',
  accounting_date: '2019-10-23T00:00:00.000Z',
  amount: 2145.45,
  balance: 16907.96,
  currency: 'MXN',
  description: 'SEVEN BUDDHAS RFC:XXXXXXXXXX',
  observations: 'OPTIONAL OBSERVATIONS',
  reference: '8703',
  type: 'OUTFLOW',
  status: 'PENDING',
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class TransactionsAPIMocker extends APIMocker {
  replyWithListOfTransactions() {
    this.scope
      .get('/api/transactions/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [transaction],
        },
      );
    return this;
  }

  replyToTransactionsDetail() {
    this.scope
      .get(`/api/transactions/${transaction.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, transaction);
  }

  replyToDeleteTransaction() {
    this.scope
      .delete(`/api/transactions/${transaction.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateTransaction() {
    this.scope
      .post('/api/transactions/', { link: linkId, date_from: '2019-10-20', date_to: moment().format('YYYY-MM-DD') })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, transaction);
  }

  replyToCreateTransactionWithOptions() {
    this.scope
      .post('/api/transactions/', {
        link: linkId, date_from: '2019-10-20', date_to: '2019-12-01', save_data: false, token: 'token123',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, transaction);
  }

  replyToCreateTransactionWithOptionsAccount() {
    this.scope
      .post('/api/transactions/', {
        link: linkId, date_from: '2019-10-20', date_to: '2019-12-01', save_data: false, token: 'token123',
        account: "123456"
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, transaction);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/transactions/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, transaction);
  }

  replyWithFilters() {
    this.scope
      .get('/api/transactions/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .query({ amount__gte: 100, type: 'INFLOW' })
      .reply(200, {
        count: 100,
        next: null,
        previous: null,
        results: [transaction]
      });
  }
}

const mocker = new TransactionsAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list transactions', async () => {
  mocker.login().replyWithListOfTransactions();

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.list();

  expect(result).toEqual([transaction]);
});

test('can retrieve transactions', async () => {
  mocker.login().replyToCreateTransaction();

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.retrieve(linkId, '2019-10-20');

  expect(result).toEqual(transaction);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve transactions with options', async () => {
  mocker.login().replyToCreateTransactionWithOptions();

  const session = await newSession();
  const transactions = new Transaction(session);
  const options = {
    dateTo: '2019-12-01',
    token: 'token123',
    saveData: false,
  };
  const result = await transactions.retrieve(linkId, '2019-10-20', options);

  expect(result).toEqual(transaction);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve transactions with options and account', async () => {
  mocker.login().replyToCreateTransactionWithOptionsAccount();

  const session = await newSession();
  const transactions = new Transaction(session);
  const options = {
    dateTo: '2019-12-01',
    account: "123456",
    token: 'token123',
    saveData: false,
  };
  const result = await transactions.retrieve(linkId, '2019-10-20', options);

  expect(result).toEqual(transaction);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see transaction detail', async () => {
  mocker.login().replyToTransactionsDetail();

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.detail(transaction.id);

  expect(result).toEqual(transaction);
});

test('can delete transaction', async () => {
  mocker.login().replyToDeleteTransaction();

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.delete(transaction.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume transaction session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(transaction);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can list transactions given filters', async () => {
  mocker.login().replyWithFilters()

  const session = await newSession();
  const transactions = new Transaction(session);
  const result = await transactions.list({
    limit: 5,
    filters: { amount__gte: 100, type: 'INFLOW' }
  });

  expect(result).toEqual([transaction]);
  expect(mocker.scope.isDone()).toBeTruthy();
});
