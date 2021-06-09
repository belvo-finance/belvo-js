type accountsResponse = {
    id?: string;
    link: string;
    institution: InstitutionShort;
    collected_at: string;
    category: string;
    type: string;
    name: string;
    number: string;
    balance: BalanceShort;
    currency: string;
    bank_product_id: string;
    internal_identification: string;
    public_identification_name: string;
    public_identification_value: string;
    last_accessed_at: string;
    credit_data?: CreditData;
    loan_data?: any;
    funds_data?: any;
    gig_payment_data?: any;
}

type balancesResponse = {
    id?: string;
    account: Pick<accountsResponse, "id" | "name" | "category" | "currency">;
    collected_at: string;
    value_date: string;
    balance: number;
}

type incomesResponse = {
    id?: string;
    collected_at: string;
    account: Pick<accountsResponse, "name" | "currency" | "category">;
    currency: string;
    sources: IncomesSource[];
}

type institutionsResponse = {
    id: number;
    name: string;
    type: string;
    code?: any;
    website: string;
    display_name: string;
    country_code: string;
    country_codes: string[];
    primary_color: string;
    logo: string;
    icon_logo?: any;
    text_logo?: any;
    form_fields: InstitutionFormFields[];
    customization?: any;
    features: any[];
}

type invoicesResponse = {
    id?: string;
    link: string;
    collected_at: string;
    invoice_identification: string;
    invoice_date: string;
    status: string;
    invoice_type: string;
    type: string;
    sender_id: string;
    sender_name: string;
    receiver_id: string;
    receiver_name: string;
    cancelation_status?: any;
    cancelation_update_date?: any;
    certification_date: string;
    certification_authority: string;
    payment_type: string;
    payment_method: string;
    usage: string;
    place_of_issue: string;
    version: string;
    invoice_details: InvoiceDetail[];
    currency: string;
    subtotal_amount: number;
    exchange_rate: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payments: any[];
    payroll?: any;
    xml: string;
    warnings: Warnings;
}

type linksResponse = {
    id: string;
    institution: string;
    access_mode: string;
    status: string;
    created_by: string;
    last_accessed_at: string;
    external_id: string | null;
}

type listResponse<T> = {
    count: number;
    next: number;
    previous: number;
    results: T[];
}

type ownersResponse = {
    id?: string;
    link: string;
    collected_at: string;
    display_name: string;
    first_name: string;
    last_name: string;
    second_last_name: string;
    email: string;
    phone_number: string;
    address: string;
    internal_identification: string;
    accounts: accountsResponse[];
    gig_data?: any;
}

type statementsResponse = {
    id?: string;
    link: string;
    account: Pick<accountsResponse, "id" | "name" | "category" | "currency">;
    collected_at: string;
    account_number: string;
    client_number: number;
    RFC: string;
    CLABE: string;
    period_start_date: string;
    period_end_date: string;
    cut_date: string;
    final_balance: number;
    previous_balance: number;
    total_inflow_amount: number;
    total_outflow_amount: number;
    total_inflow_transactions: number;
    total_outflow_transactions: number;
    transactions: transactionsResponse[];
    pdf: string;
}

type taxComplianceStatusResponse = {
    id?: string;
    collected_at: string;
    internal_identification: string;
    pdf: string;
    rfc: string;
    outcome: string;
}

type taxReturnsResponse = {
    id?: string;
    link: string;
    collected_at: string;
    informacion_general: object;
    sueldos_salarios: object;
    servicios_profesionales: object;
    deducciones_personales: object;
    determinacion_impuesto: object;
    retenciones: object;
    dividendos: object;
    datos_informativos: object;
    pdf: string;
    receipt_pdf: string;
}

type taxStatusResponse = {
    id?: string;
    link: string;
    collected_at: string;
    place_and_date_of_issuance: string;
    official_name: string;
    id_cif: string;
    tax_payer_information: TaxPayerInformation;
    address: Address;
    economic_activity: EconomicActivity[];
    regimes: Regime[];
    obligations: Obligation[];
    digital_stamp: string;
    digital_stamp_chain: string;
    pdf: string;
}

type transactionsResponse = {
    id?: string;
    account: accountsResponse;
    collected_at: string;
    value_date: string;
    accounting_date: string;
    internal_identification: string | null;
    amount: number;
    balance: number;
    currency: string;
    description: string;
    observations: string;
    category: string;
    reference: string;
    type: string;
    status: string;
    gig_data?: any;
    credit_card_data: CreditCardData;
}

type widgetTokenResponse = {
    access: string;
    refresh: string;
}

type InstitutionShort = {
    name: string;
    type: string;
}

type BalanceShort = {
    available: number;
    current: number;
}

type InstitutionFormFields = {
    name: string;
    type: string;
    label: string;
    validation: string;
    placeholder: string;
    validation_message: string;
}

type IncomesSource = {
    transactions: Pick<transactionsResponse, "amount" | "value_date" | "description">;
    confidence: string;
    type: string;
}

type CreditCardData = {
    bill_name: string;
}

type CreditData = {
    credit_limit: number;
    collected_at: string;
    cutting_date: string;
    end_date: string;
    minimum_payment: number;
    monthly_payment: number;
    no_interest_payment: number;
    last_payment_date: string;
    last_period_balance: number;
    interest_rate: number;
}

type InvoiceDetail = {
    description: string;
    product_identification: string;
    quantity: number;
    unit_code: string;
    unit_description: string;
    unit_amount: number;
    pre_tax_amount: number;
    tax_percentage: number;
    tax_amount: number;
    total_amount: number;
    retained_taxes: any[];
    collected_at: string;
}

type Warnings = {
    code: string;
    message: string;
}

type TaxPayerInformation = {
    rfc: string;
    curp: string;
    name: string;
    first_last_name: string;
    second_last_name: string;
    start_operations_date: string;
    status_padron: string;
    last_status_change_date: string;
    commercial_name: string;
    social_name?: any;
    email: string;
    phone: string;
}

type Address = {
    postal_code: string;
    street_type: string;
    street: string;
    exterior_number: string;
    interior_number: string;
    suburb: string;
    locality?: any;
    municipality: string;
    state: string;
    between_street: string[];
}

type EconomicActivity = {
    order: string;
    economic_activity: string;
    percentage: string;
    initial_date: string;
    end_date?: any;
}

type Regime = {
    regime: string;
    initial_date: string;
    end_date?: any;
}

type Obligation = {
    obligation: string;
    expiration: string;
    initial_date: string;
    end_date?: any;
}

export {
    accountsResponse,
    balancesResponse,
    incomesResponse,
    institutionsResponse,
    invoicesResponse,
    linksResponse,
    listResponse,
    ownersResponse,
    statementsResponse,
    taxComplianceStatusResponse,
    taxReturnsResponse,
    taxStatusResponse,
    transactionsResponse,
    widgetTokenResponse
}