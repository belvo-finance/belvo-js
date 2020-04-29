import APISession from './http';
import Account from './accounts';
import Balance from './balances';
import Institution from './institutions';
import Invoice from './invoices';
import Link from './links';
import Owner from './owners';
import Statement from './statements';
import TaxReturn from './taxReturns';
import Transaction from './transactions';

class Client {
  constructor(secretKeyId, secretKeyPassword, url = null) {
    this.session = new APISession(url);
    this.secretKeyId = secretKeyId;
    this.secretKeyPassword = secretKeyPassword;
  }

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
    this.statements = new Statement(this.session);
  }
}

export default Client;
