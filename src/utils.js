import { readFileSync, existsSync } from 'fs';

const encodeFileB64 = (path) => {
  if (path && existsSync(path)) {
    return readFileSync(path).toString('BASE64');
  }
  return null;
};

const Environment = Object.freeze({
  SANDBOX: 'https://sandbox.belvo.com',
  DEVELOPMENT: 'https://development.belvo.com',
  PRODUCTION: 'https://api.belvo.com',
});

const urlResolver = (environment = '') => {
  if (environment) {
    return Environment[environment.toUpperCase()] || environment;
  }
  return null;
};

// eslint-disable-next-line import/prefer-default-export
export { encodeFileB64, urlResolver };
