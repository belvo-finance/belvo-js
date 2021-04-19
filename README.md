<h1 align="center">Belvo Js</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/belvo"><img alt="npm" src="https://img.shields.io/npm/v/belvo?style=for-the-badge"></a>
    <img alt="Github build" src="https://img.shields.io/github/workflow/status/belvo-finance/belvo-js/Tests?style=for-the-badge">
    <a href="https://coveralls.io/github/belvo-finance/belvo-js"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/belvo-finance/belvo-js?style=for-the-badge"></a>
    <a href="https://codeclimate.com/github/belvo-finance/belvo-js"><img alt="CodeClimate maintainability" src="https://img.shields.io/codeclimate/maintainability/belvo-finance/belvo-js?style=for-the-badge"></a>
</p>

## 📕 Documentation
How to use `belvo-js`: https://belvo-finance.github.io/belvo-js/

If you want to check the full documentation about Belvo API: https://docs.belvo.com

Or if you want to more information about:
* [Getting Belvo API keys](https://developers.belvo.com/docs/get-your-belvo-api-keys)
* [Using Connect Widget](https://developers.belvo.com/docs/connect-widget)
* [Testing in sandbox](https://developers.belvo.com/docs/test-in-sandbox)
* [Using webhooks and recurrent links](https://developers.belvo.com/docs/webhooks)

## Installation
Install the package using npm
```
$ npm install belvo --save
```

## Usage
```javascript
var belvo = require("belvo").default;

var client = new belvo(
  'YOUR-KEY-ID',
  'YOUR-SECRET',
  'https://sandbox.belvo.com'
);

client.connect()
  .then(function () {
    client.links.list()
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
});
```
Or if you prefer to use ES6 and async/await

```javascript
import Client from 'belvo';

const client = new Client(
  'YOUR-KEY-ID',
  'YOUR-SECRET',
  'https://sandbox.belvo.com'
);

async function getLinks() {
  try {
    const links = await client.links.list();
    console.log(links);
  } catch (error) {
    console.log(error);
  }
}
```

## Development
After checking out the repo, run `npm install` to install dependencies. Then, run `npm test` to run the tests.

To release a new version:
- Use `npm version major|minor|patch` to bump a new version.
- Create a new pull request for the new version.
- Once the new version is merged in `master`, create a `tag` matching the new version.

### Linting
Make sure to run `npm run lint`. Otherwise the build will break. 

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/belvo-finance/belvo-js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/belvo-finance/belvo-js/blob/master/CODE_OF_CONDUCT.md).

If you wish to submit a pull request, please be sure check the items on this list:
- [ ] Tests related to the changed code were executed
- [ ] The source code has been coded following [the OWASP security best practices](https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf).
- [ ] Commit message properly labeled
- [ ] There is a ticket associated to each PR. 


## Code of Conduct

Everyone interacting in the Belvo project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/belvo-finance/belvo-js/blob/master/CODE_OF_CONDUCT.md).
