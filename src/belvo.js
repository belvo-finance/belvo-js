import APISession from './http';
import Account from './accounts';
import Balance from './balances';
import Institution from './institutions';
import Invoice from './invoices';
import Link from './links';
import Owner from './owners';
import Statement from './statements';
import Income from './incomes';
import TaxComplianceStatus from './taxComplianceStatus';
import TaxReturn from './taxReturns';
import TaxStatus from './taxStatus';
import Transaction from './transactions';
import WidgetToken from './widgetToken';
import { urlResolver } from './utils';

class Client {
  /**
   * Instantiate the Belvo SDK
   * @param {string} secretKeyId - Enter your secretId generated on Belvo's dashboard
   * @param {string} secretKeyPassword - Enter your secretPassword generated on Belvo's dashboard
   * @param {string} url - Belvo base URL or environment (`sandbox`, `development` or `production`)
   */
  constructor(secretKeyId, secretKeyPassword, url = null) {
    const belvoUrl = urlResolver(url || process.env.BELVO_API_URL);

    if (!belvoUrl) {
      throw new Error('You need to provide a URL or a valid environment.');
    }

    this.session = new APISession(url);
    this.secretKeyId = secretKeyId;
    this.secretKeyPassword = secretKeyPassword;
  }

  /**
   * Start the session with Belvo (if not ES6 - async/await)
   * @async
   * @returns {Promise<void>} an empty Promise is returned
   */
  async connect() {
    const login = await this.session.login(this.secretKeyId, this.secretKeyPassword);
    if (!login) {
      throw new Error('Login failed.');
    }

    this.institutions = new Institution(this.session);
    this.links = new Link(this.session);
    this.accounts = new Account(this.session);
    this.transactions = new Transaction(this.session);
    this.owners = new Owner(this.session);
    this.balances = new Balance(this.session);
    this.invoices = new Invoice(this.session);
    this.taxReturns = new TaxReturn(this.session);
    this.taxComplianceStatus = new TaxComplianceStatus(this.session);
    this.taxStatus = new TaxStatus(this.session);
    this.statements = new Statement(this.session);
    this.incomes = new Income(this.session);
    this.widgetToken = new WidgetToken(this.session);
  }
}

export default Client;
