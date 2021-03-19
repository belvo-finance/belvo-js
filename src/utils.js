import { readFileSync, existsSync } from 'fs';

const encodeFileB64 = (path) => {
  if (path && existsSync(path)) {
    return readFileSync(path).toString('BASE64');
  }
  return null;
};

// eslint-disable-next-line import/prefer-default-export
export { encodeFileB64 };
