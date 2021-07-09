import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Statement from '../src/statements';

const statement = {
  id: '076c66e5-90f5-4e01-99c7-50e32f65ae42',
  link: '30cb4806-6e00-48a4-91c9-ca55968576c8',
  account: {
    name: 'Cuenta Perfiles- M.N. - MXN-666',
    category: 'CHECKING_ACCOUNT',
    currency: 'MXN',
    id: '0d3ffb69-f83b-456e-ad8e-208d0998d71d',
  },
  collected_at: '2019-09-27T13:01:41.941Z',
  RFC: 'string',
  CLABE: 'string',
  transactions: [],
  client_number: 'string',
  final_balance: 5621.12,
  previous_balance: 5621.12,
  account_number: 'string',
  period_end_date: '2020-01-31',
  period_start_date: '2020-01-01',
  total_inflow_amount: 5621.12,
  total_outflow_amount: 5621.12,
  total_inflow_transactions: 12,
  total_outflow_transactions: 12,
  pdf: 'string',
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

const accountId = '0d3ffb69-f83b-456e-ad8e-208d0998d71d';

class StatementsAPIMocker extends APIMocker {
  replyWithListOfStatements() {
    this.scope
      .get('/api/statements/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [statement],
        },
      );
    return this;
  }

  replyToStatementDetail() {
    this.scope
      .get(`/api/statements/${statement.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, statement);
  }

  replyToDeleteStatement() {
    this.scope
      .delete(`/api/statements/${statement.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateStatement() {
    this.scope
      .post('/api/statements/', {
        link: linkId, account: accountId, year: 2020, month: 1,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, statement);
  }

  replyToCreateStatementWithOptions() {
    this.scope
      .post('/api/statements/', {
        link: linkId,
        account: accountId,
        year: 2020,
        month: 1,
        save_data: false,
        token: 'token123',
        attach_pdf: false,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, statement);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/statements/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, statement);
  }
}

const mocker = new StatementsAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list statements', async () => {
  mocker.login().replyWithListOfStatements();

  const session = await newSession();
  const statements = new Statement(session);
  const result = await statements.list();

  expect(result).toEqual([statement]);
});

test('can retrieve statements', async () => {
  mocker.login().replyToCreateStatement();

  const session = await newSession();
  const statements = new Statement(session);
  const result = await statements.retrieve(linkId, accountId, 2020, 1);

  expect(result).toEqual(statement);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve statements with options', async () => {
  mocker.login().replyToCreateStatementWithOptions();

  const session = await newSession();
  const statements = new Statement(session);
  const options = {
    token: 'token123',
    saveData: false,
    attachPDF: false,
  };
  const result = await statements.retrieve(linkId, accountId, 2020, 1, options);

  expect(result).toEqual(statement);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see statement detail', async () => {
  mocker.login().replyToStatementDetail();

  const session = await newSession();
  const statements = new Statement(session);
  const result = await statements.detail(statement.id);

  expect(result).toEqual(statement);
});

test('can delete statement', async () => {
  mocker.login().replyToDeleteStatement();

  const session = await newSession();
  const statements = new Statement(session);
  const result = await statements.delete(statement.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume statement session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const statements = new Statement(session);
  const result = await statements.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(statement);
  expect(mocker.scope.isDone()).toBeTruthy();
});
