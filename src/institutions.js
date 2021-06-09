import Resource from './resources';

/**
 * An Institution is an entity that Belvo can access information from.
 * It can be a bank (Banamex retail banking, HSBC corporate banking) or
 * fiscal type of institutions such as the "Servicio de Administración Tributaria" (SAT) in Mexico.
 * 
 * @typedef { import("../types/apiResponses").institutionsResponse } Response
 * @extends Resource<Response>
 */
class Institution extends Resource {
  #endpoint = 'api/institutions/'

  /** @private */
  delete() {}

  /** @private */
  resume() {}
}

export default Institution;
