import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import TaxComplianceStatus from '../src/taxComplianceStatus';

const taxComplianceStatus = {
  internal_identification: "20NE1234567",
	rfc: "KDFC211118IS0",
	status: "NO_OBLIGATIONS",
  collected_at: '2020-01-07T08:30:17.861202+00:00',
  pdf: null,
};

const linkId = 'ef68519c-8004-4a8d-a74a-2a64c3cdc778';

class TaxComplianceStatusAPIMocker extends APIMocker {
  replyWithListOfTaxComplianceStatus() {
    this.scope
      .get('/api/tax-compliance-status/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [taxComplianceStatus],
        },
      );
    return this;
  }

  replyToTaxComplianceStatusDetail() {
    this.scope
      .get(`/api/tax-compliance-status/${taxComplianceStatus.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(200, taxComplianceStatus);
  }

  replyToDeleteTaxComplianceStatus() {
    this.scope
      .delete(`/api/tax-compliance-status/${taxComplianceStatus.id}/`)
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(204);
  }

  replyToCreateTaxComplianceStatus() {
    this.scope
      .post('/api/tax-compliance-status/', { link: linkId })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxComplianceStatus);
  }

  replyToCreateTaxComplianceStatusWithOptions() {
    this.scope
      .post('/api/tax-compliance-status/', {
        link: linkId,
        save_data: false,
        attach_pdf: false,
      })
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(201, taxComplianceStatus);
  }
}

const mocker = new TaxComplianceStatusAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list tax compliance status', async () => {
  mocker.login().replyWithListOfTaxComplianceStatus();

  const session = await newSession();
  const taxComplianceStatusResource = new TaxComplianceStatus(session);
  const result = await taxComplianceStatusResource.list();

  expect(result).toEqual([taxComplianceStatus]);
});

test('can retrieve tax compliance status', async () => {
  mocker.login().replyToCreateTaxComplianceStatus();

  const session = await newSession();
  const taxComplianceStatusResource = new TaxComplianceStatus(session);
  const result = await taxComplianceStatusResource.retrieve(linkId);

  expect(result).toEqual(taxComplianceStatus);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can retrieve tax compliance status with options', async () => {
  mocker.login().replyToCreateTaxComplianceStatusWithOptions();

  const session = await newSession();
  const taxComplianceStatusResource = new TaxComplianceStatus(session);
  const options = {
    saveData: false,
    attachPDF: false,
  };
  const result = await taxComplianceStatusResource.retrieve(linkId, options);

  expect(result).toEqual(taxComplianceStatus);
  expect(mocker.scope.isDone()).toBeTruthy();
});

test('can see tax compliance status detail', async () => {
  mocker.login().replyToTaxComplianceStatusDetail();

  const session = await newSession();
  const taxComplianceStatusStatusResource = new TaxComplianceStatus(session);
  const result = await taxComplianceStatusStatusResource.detail(taxComplianceStatus.id);

  expect(result).toEqual(taxComplianceStatus);
});

test('can delete tax compliance status', async () => {
  mocker.login().replyToDeleteTaxComplianceStatus();

  const session = await newSession();
  const taxComplianceStatusStatusResource = new TaxComplianceStatus(session);
  const result = await taxComplianceStatusStatusResource.delete(taxComplianceStatus.id);

  expect(result).toBeTruthy();
  expect(mocker.scope.isDone).toBeTruthy();
});
