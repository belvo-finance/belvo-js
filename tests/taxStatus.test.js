import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import TaxStatus from '../src/taxStatus';

const taxStatus = {
  collected_at: '2020-01-07T08:30:17.861202+00:00',
  pdf: null,
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class TaxStatusAPIMocker extends APIMocker {
  replyWithListOfTaxStatus() {
    this.scope
      .get('/api/tax-status/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [taxStatus],
        },
      );
    return this;
  }

  replyToTaxStatusDetail() {
    this.scope
      .get(`/api/tax-status/${taxStatus.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, taxStatus);
  }

  replyToDeleteTaxStatus() {
    this.scope
      .delete(`/api/tax-status/${taxStatus.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateTaxStatus() {
    this.scope
      .post('/api/tax-status/', { link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxStatus);
  }

  replyToCreateTaxStatusWithOptions() {
    this.scope
      .post('/api/tax-status/', {
        link: linkId,
        save_data: false,
        attach_pdf: false,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxStatus);
  }
}

const mocker = new TaxStatusAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list tax status', async () => {
  mocker.login().replyWithListOfTaxStatus();

  const session = await newSession();
  const taxStatusResource = new TaxStatus(session);
  const result = await taxStatusResource.list();

  expect(result).toEqual([taxStatus]);
});

test('can retrieve tax status', async () => {
  mocker.login().replyToCreateTaxStatus();

  const session = await newSession();
  const taxStatusResource = new TaxStatus(session);
  const result = await taxStatusResource.retrieve(linkId);

  expect(result).toEqual(taxStatus);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve tax status with options', async () => {
  mocker.login().replyToCreateTaxStatusWithOptions();

  const session = await newSession();
  const taxStatusResource = new TaxStatus(session);
  const options = {
    saveData: false,
    attachPDF: false,
  };
  const result = await taxStatusResource.retrieve(linkId, options);

  expect(result).toEqual(taxStatus);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see tax status detail', async () => {
  mocker.login().replyToTaxStatusDetail();

  const session = await newSession();
  const taxStatusResource = new TaxStatus(session);
  const result = await taxStatusResource.detail(taxStatus.id);

  expect(result).toEqual(taxStatus);
});

test('can delete tax status', async () => {
  mocker.login().replyToDeleteTaxStatus();

  const session = await newSession();
  const taxStatusResource = new TaxStatus(session);
  const result = await taxStatusResource.delete(taxStatus.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});
