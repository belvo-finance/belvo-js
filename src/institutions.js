import Resource from './resources';

/**
 * @typedef { import("../types/apiResponses").institutionsResponse } Response
 */

/**
 * An Institution is an entity that Belvo can access information from.
 * It can be a bank (Banamex retail banking, HSBC corporate banking) or
 * fiscal type of institutions such as the "Servicio de Administración Tributaria" (SAT) in Mexico.
 * @extends Resource<Response>
 */
class Institution extends Resource {
  #endpoint = 'api/institutions/'

  /* eslint-disable class-methods-use-this */
  /** @private */
  delete() {}

  /* eslint-disable class-methods-use-this */
  /** @private */
  resume() {}
}

export default Institution;
