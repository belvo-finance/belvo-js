import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Invoice from '../src/invoices';

const invoice = {
  id: '076c66e5-90f5-4e01-99c7-50e32f65ae42',
  link: '30cb4806-6e00-48a4-91c9-ca55968576c8',
  collected_at: '2019-09-27T13:01:41.941Z',
  type: 'INFLOW',
  invoice_identification: 'A1A1A1A1-2B2B-3C33-D44D-555555E55EE',
  invoice_date: '2019-12-01',
  sender_id: 'AAA111111AA11',
  sender_name: 'ACME CORP',
  receiver_id: 'BBB222222BB22',
  receiver_name: 'BELVO CORP',
  certification_date: '2019-12-01',
  certification_authority: 'CCC333333CC33',
  cancelation_status: 'string',
  status: 'Vigente',
  cancelation_update_date: '2019-12-02',
  invoice_details: [
    {
      collected_at: '2019-09-27T13:01:41.941Z',
      description: 'December 2019 invoiceing fees',
      product_identification: '84101600',
      quantity: 1,
      unit_amount: 200,
      unit_description: 'Unidad de servicio',
      unit_code: 'E48',
      pre_tax_amount: 400,
      tax_percentage: 16,
      tax_amount: 64,
      total_amount: 464,
    },
  ],
  subtotal_amount: 400,
  tax_amount: 64,
  discount_amount: 10,
  total_amount: 454,
  exchange_rate: 0.052,
  currency: 'MXN',
  payment_type_description: 'string',
  payment_method_description: 'string',
  payment_type: '99',
  payment_method: 'PUE',
  xml: 'string',
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class InvoicesAPIMocker extends APIMocker {
  replyWithListOfInvoices() {
    this.scope
      .get('/api/invoices/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [invoice],
        },
      );
    return this;
  }

  replyToInvoicesDetail() {
    this.scope
      .get(`/api/invoices/${invoice.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, invoice);
  }

  replyToDeleteInvoice() {
    this.scope
      .delete(`/api/invoices/${invoice.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateInvoice() {
    this.scope
      .post('/api/invoices/', {
        link: linkId,
        date_from: '2019-10-20',
        date_to: '2019-12-01',
        type: 'INFLOW',
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, invoice);
  }

  replyToCreateInvoiceWithOptions() {
    this.scope
      .post('/api/invoices/', {
        link: linkId,
        date_from: '2019-10-20',
        date_to: '2019-12-01',
        type: 'INFLOW',
        save_data: false,
        token: 'token123',
        attach_xml: false,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, invoice);
  }

  replyToResumeSession() {
    this.scope
      .patch('/api/invoices/', { session: 'abc123', token: 'my-token', link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, invoice);
  }
}

const mocker = new InvoicesAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list invoices', async () => {
  mocker.login().replyWithListOfInvoices();

  const session = await newSession();
  const invoices = new Invoice(session);
  const result = await invoices.list();

  expect(result).toEqual([invoice]);
});

test('can retrieve invoices', async () => {
  mocker.login().replyToCreateInvoice();

  const session = await newSession();
  const invoices = new Invoice(session);
  const result = await invoices.retrieve(linkId, '2019-10-20', '2019-12-01', 'INFLOW');

  expect(result).toEqual(invoice);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve invoices with options', async () => {
  mocker.login().replyToCreateInvoiceWithOptions();

  const session = await newSession();
  const invoices = new Invoice(session);
  const options = {
    token: 'token123',
    saveData: false,
    attachXML: false,
  };
  const result = await invoices.retrieve(linkId, '2019-10-20', '2019-12-01', 'INFLOW', options);

  expect(result).toEqual(invoice);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see invoice detail', async () => {
  mocker.login().replyToInvoicesDetail();

  const session = await newSession();
  const invoices = new Invoice(session);
  const result = await invoices.detail(invoice.id);

  expect(result).toEqual(invoice);
});

test('can delete invoice', async () => {
  mocker.login().replyToDeleteInvoice();

  const session = await newSession();
  const invoices = new Invoice(session);
  const result = await invoices.delete(invoice.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});

test('can resume invoice session', async () => {
  mocker.login().replyToResumeSession();

  const session = await newSession();
  const invoices = new Invoice(session);
  const result = await invoices.resume('abc123', 'my-token', linkId);

  expect(result).toEqual(invoice);
  expect(mocker.scope.isDone()).toBeTruthy();
});
