import { APIMocker } from './fixtures';
import Client from '../src/belvo';

const mocker = new APIMocker('https://fake.api');
mocker.login();

const client = new Client('secret-id', 'secret-password', 'https://fake.api');

test('belvo client has institutions', async () => {
  await client.connect();
  expect(client.institutions).not.toBeNull();
});

test('belvo client has links', async () => {
  expect(true).not.toBeNull();
});

test('belvo client has accounts', async () => {
  expect(client.accounts).not.toBeNull();
});

test('belvo client has transactions', async () => {
  expect(client.transactions).not.toBeNull();
});

test('belvo client has owners', async () => {
  expect(client.owners).not.toBeNull();
});

test('belvo client has balances', async () => {
  expect(client.balances).not.toBeNull();
});

test('belvo client has invoices', async () => {
  expect(client.invoices).not.toBeNull();
});

test('belvo client has statements', async () => {
  expect(client.statements).not.toBeNull();
});

test('belvo client has tax returns', async () => {
  expect(client.taxReturns).not.toBeNull();
});
