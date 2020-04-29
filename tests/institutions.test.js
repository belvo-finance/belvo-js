import nock from 'nock';
import { APIMocker, newSession } from './fixtures';
import Institution from '../src/institutions';

const institution = {
  name: 'banamex',
  type: 'bank',
  website: 'https://www.banamex.com/',
  display_name: 'Citibanamex',
  country_codes: [
    'MX',
  ],
  primary_color: '#056dae',
  logo: 'https://belvo-api-media.s3.amazonaws.com/logos/citibanamex_logo.png',
  form_fields: [
    {
      name: 'username',
      type: 'text',
      label: 'Client number',
      validation: '^.{1,}$',
      placeholder: 'ABC333333A33',
      validation_message: 'Invalid client number',
    },
    {
      name: 'password',
      type: 'password',
      label: 'Key BancaNet',
      validation: '^.{1,}$',
      placeholder: '********',
      validation_message: 'Invalid password',
    },
    {
      name: 'username_type',
      type: 'select',
      label: 'Document',
      validation: '^.{1,}$',
      placeholder: 'Document type',
      validation_message: 'Select a document',
      values: [
        {
          code: '001',
          label: 'Cédula de Ciudadanía',
        },
        {
          code: '002',
          label: 'Cédula de Extranjería',
        },
        {
          code: '003',
          label: 'Pasaporte',
        },
      ],
    },
  ],
};

class InstitutionsAPIMocker extends APIMocker {
  replyWithListOfInstitutions() {
    this.scope
      .get('/api/institutions/')
      .basicAuth({ user: 'secret-id', pass: 'secret-password' })
      .reply(
        200,
        {
          count: 1,
          next: null,
          previous: null,
          results: [institution],
        },
      );
    return this;
  }
}

const mocker = new InstitutionsAPIMocker('https://fake.api');

beforeEach(async () => {
  nock.cleanAll();
});

test('can list accounts', async () => {
  mocker.login().replyWithListOfInstitutions();

  const session = await newSession();
  const institutions = new Institution(session);
  const result = await institutions.list();

  expect(result).toEqual([institution]);
});
