export default Institution;
export type Response = import("../types/apiResponses").institutionsResponse;
/**
 * @typedef { import("../types/apiResponses").institutionsResponse } Response
 */
/**
 * An Institution is an entity that Belvo can access information from.
 * It can be a bank (Banamex retail banking, HSBC corporate banking) or
 * fiscal type of institutions such as the "Servicio de Administración Tributaria" (SAT) in Mexico.
 * @extends Resource<Response>
 */
declare class Institution extends Resource<import("../types/apiResponses").institutionsResponse> {
    constructor(session: any);
    #private;
}
import Resource from "./resources";
