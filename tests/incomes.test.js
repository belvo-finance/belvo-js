import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Income from '../src/incomes';

const linkId = 'a39facc8-8004-4a8d-a74a-2a64c3cdc778';

const incomesResp = [
  {
    id: '076c66e5-90f5-4e01-99c7-50e32f65ae42',
    link: linkId,
    collected_at: '2019-09-27T13:01:41.941Z',
    value_date: '2019-09-01',
    transactions: [
        {
            amount: 12444.04,
            value_date: "2019-09-23",
            description: "DEPOSITO NOMINA",
            account: {
                name: "NOMINA FLEXIBLE HSBC",
                category: "CHECKING_ACCOUNT"
            }
        },
    ],
    number_of_income_transactions: 1,
    income_amount: 12420.04,
  }
];

class IncomesAPIMocker extends APIMocker {
  replyToCreateIncome() {
    this.scope
      .post('/api/incomes/', {link: linkId})
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, incomesResp);
  }

  replyToCreateIncomesWithOptions() {
    this.scope
      .post('/api/incomes/', {
        link: linkId,
        save_data: false,
        encryption_key: '123pollitoingles',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, incomesResp);
  }

}

const mocker = new IncomesAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can retrieve incomes', async () => {
  mocker.login().replyToCreateIncome();

  const session = await newSession();
  const incomes = new Income(session);
  const result = await incomes.retrieve(linkId);

  expect(result).toEqual(incomesResp);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve incomes with options', async () => {
  mocker.login().replyToCreateIncomesWithOptions();

  const session = await newSession();
  const incomes = new Income(session);
  const options = {
    encryptionKey: '123pollitoingles',
    saveData: false,
  };
  const result = await incomes.retrieve(linkId, options);

  expect(result).toEqual(incomesResp);
  expect(mocker.scope.isDone()).toBeTruthy();
});
