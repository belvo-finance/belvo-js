export default Client;
declare class Client {
    /**
     * Instantiate the Belvo SDK
     * @param {string} secretKeyId - Enter your secretId generated on Belvo's dashboard
     * @param {string} secretKeyPassword - Enter your secretPassword generated on Belvo's dashboard
     * @param {string} url - Belvo base URL or environment (`sandbox`, `development` or `production`)
     */
    constructor(secretKeyId: string, secretKeyPassword: string, url?: string);
    session: APISession;
    secretKeyId: string;
    secretKeyPassword: string;
    /**
     * Start the session with Belvo (if not ES6 - async/await)
     * @async
     * @returns {Promise<void>} an empty Promise is returned
     */
    connect(): Promise<void>;
    institutions: Institution;
    links: Link;
    accounts: Account;
    transactions: Transaction;
    owners: Owner;
    balances: Balance;
    invoices: Invoice;
    taxReturns: TaxReturn;
    taxComplianceStatus: TaxComplianceStatus;
    taxStatus: TaxStatus;
    statements: Statement;
    incomes: Income;
    widgetToken: WidgetToken;
}
import APISession from "./http";
import Institution from "./institutions";
import Link from "./links";
import Account from "./accounts";
import Transaction from "./transactions";
import Owner from "./owners";
import Balance from "./balances";
import Invoice from "./invoices";
import TaxReturn from "./taxReturns";
import TaxComplianceStatus from "./taxComplianceStatus";
import TaxStatus from "./taxStatus";
import Statement from "./statements";
import Income from "./incomes";
import WidgetToken from "./widgetToken";
