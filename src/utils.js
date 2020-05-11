import { readFileSync, existsSync } from 'fs';


const encodeFileB64 = (path) => {
  if (path && existsSync(path)) {
    return readFileSync(path).toString('BASE64');
  }
  return null;
};

export { encodeFileB64 };
