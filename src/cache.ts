import fs from 'fs';
import os from 'os';
import path from 'path';

import { copyDir } from './functions/copy';

const homeDir = os.homedir();

import argv from './argv';

import config from '../config/config';

const cwd = process.cwd();

const InitCache = () => {
  if (typeof argv.c === 'string') {
    if (!fs.existsSync(homeDir + '/.cronos')) {
      fs.mkdirSync(homeDir + '/.cronos');
    }
  }

  if (config.customTemplateDir) {
    if (!fs.existsSync(homeDir + '/.cronos/templates')) {
      fs.mkdirSync(homeDir + '/.cronos/templates');
    }

    if (!fs.existsSync(cwd + '/' + config.customTemplateDir)) {
      console.log('The template directory does not exist.');
      process.exit(1);
    }

    const templateDir = path.join(cwd, config.customTemplateDir);

    const targetDir = path.join(homeDir, '.cronos', 'templates');

    if (fs.existsSync(path.join(targetDir, config.customTemplateDir))) {
      console.log('Template already exists.');
      return;
    }

    copyDir(templateDir, targetDir);
  }
};

export default InitCache;
