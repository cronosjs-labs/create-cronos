import fs from 'fs';
import os from 'os';
import path from 'path';

import { copyDir } from './functions/copy';

const currentDir = __dirname;

const homeDir = os.homedir();

import argv from './argv';

const InitCache = () => {

  if (typeof argv.c === 'string' && typeof argv.t === 'string') {
    if (!fs.existsSync(homeDir + '/.cronos')) {
      fs.mkdirSync(homeDir + '/.cronos');
    }

    if (!fs.existsSync(homeDir + '/.cronos/templates')) {
      fs.mkdirSync(homeDir + '/.cronos/templates');
    }

    const templateDir = path.join(currentDir, '../templates');

    const targetDir = path.join(homeDir, '.cronos', 'templates');

    copyDir(templateDir, targetDir);
  }
};

export default InitCache;
