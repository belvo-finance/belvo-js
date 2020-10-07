<h1 align="center">Belvo Js</h1>
<p align="center">
    <a href="https://www.npmjs.com/package/belvo"><img alt="npm" src="https://img.shields.io/npm/v/belvo?style=for-the-badge"></a>
    <img alt="Github build" src="https://img.shields.io/github/workflow/status/belvo-finance/belvo-js/Tests?style=for-the-badge">
    <a href="https://coveralls.io/github/belvo-finance/belvo-js"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/belvo-finance/belvo-js?style=for-the-badge"></a>
    <a href="https://codeclimate.com/github/belvo-finance/belvo-js"><img alt="CodeClimate maintainability" src="https://img.shields.io/codeclimate/maintainability/belvo-finance/belvo-js?style=for-the-badge"></a>
</p>
<p align="center"><a href="https://developers.belvo.co">Developers portal</a> | <a href="https://belvo-finance.github.io/belvo-js/index.html">Documentation</a></p>

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
  'https://sandbox.belvo.co'
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
  'https://sandbox.belvo.co'
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
- Create a `tag` matching the new version.
- Travis pipeline will publish to `npmjs`

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/belvo-finance/belvo-js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/belvo-finance/belvo-js/blob/master/CODE_OF_CONDUCT.md).


## Code of Conduct

Everyone interacting in the Belvo project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/belvo-finance/belvo-js/blob/master/CODE_OF_CONDUCT.md).
