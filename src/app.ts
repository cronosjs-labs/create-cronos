#!/usr/bin/env node

//! esm
import readline from 'readline';
import fs from 'fs';

import { build } from 'esbuild';

//! commonjs
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

//! VARIABLES
const currentDir = __dirname;

const OS = process.platform;

const homeDir = os.homedir();

//! TYPES

import { Project } from '../types/Project';
import { Data } from '../types/Data';

//! Config
import config from '../config/config';
let Config = config;

//* ----------------------------------------------------------------------------------------

/**
 * Copies a directory from a source to a destination.
 *
 * @param {string} srcDir - The source directory to copy from.
 * @param {string} destDir - The destination directory to copy to.
 */

const copyDir = (srcDir: string, destDir: string) => {
  try {
    fs.mkdirSync(destDir, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  try {
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      copy(srcFile, destFile);
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Copies a file or a directory from a source to a destination.
 * If the source is a directory, it uses the copyDir function to copy it.
 *
 * @param {string} src - The source file or directory to copy from.
 * @param {string} dest - The destination file or directory to copy to.
 */

const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    try {
      if (src.includes('_gitignore')) {
        const newDest = dest.replace('_', '.');
        fs.copyFileSync(src, newDest);
      } else {
        fs.copyFileSync(src, dest);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * This function logs a success message to the console after a project has been created successfully.
 * It provides the user with instructions on how to start using the project.
 *
 * @param name - The name of the project. It can be a string or any other type.
 */

//! MAIN
const main = async () => {
  //! CHECK IF LOCAL CONFIG IS PASSED USING THE -c FLAG
  const args = process.argv.slice(2);
  const configIndex = args.indexOf('-c');
  const configPath = args[configIndex + 1];

  if (args.includes('-c')) {
    //! INSTALL THE NEW CONFIG
    if (configPath) {
      const absoluteConfigPath = path.resolve(process.cwd(), configPath);
      const normalizedPath = absoluteConfigPath
        .replace(/\\/g, '/')
        .replace('C:/', '/');

      if (configPath) {
        console.log('Compiling local config...');

        const isTS = normalizedPath.endsWith('.ts');

        //! CHECK IF THE PASSED CONFIG IS A TYPESCRIPT FILE
        if (isTS) {
          console.log('Typescript config detected');

          await build({
            entryPoints: [normalizedPath],
            outfile: homeDir + '/.cronos/config.js',
            bundle: true,
            loader: { '.ts': 'ts' },
            platform: 'node'
          });

          const localConfigPath = homeDir + '/.cronos/config.js';

          const normalizedLocalConfigPath = localConfigPath
            .replace(/\\/g, '/')
            .replace('C:/', '/');

          const localConfig = await import(normalizedLocalConfigPath);

          Config = localConfig.default.default;

          console.log('Local config loaded');
        }
        //! IF THE PASSED CONFIG IS A JAVASCRIPT FILE
        else {
          const localConfig = await import(normalizedPath);

          Config = localConfig.default.default;

          if (!fs.existsSync(homeDir + '/.cronos')) {
            fs.mkdirSync(homeDir + '/.cronos');
          }

          fs.copyFileSync(normalizedPath, homeDir + '/.cronos/config.js');

          console.log('Local config loaded');
        }
      }
    }
    //! TRY TO LOAD THE LOCAL CONFIG IF IT EXISTS
    else {
      const configExist = fs.existsSync(homeDir + '/.cronos' + '/config.js');
      if (configExist) {
        const localConfigPath = homeDir + '/.cronos/config.js';

        const normalizedLocalConfigPath = localConfigPath
          .replace(/\\/g, '/')
          .replace('C:/', '/');

        const localConfig = await import(normalizedLocalConfigPath);

        Config = localConfig.default.default;

        console.log('Local config loaded');
      }
    }
  }

  //! PRINT BANNER

  if (typeof Config.banner === 'function') {
    Config.banner();
  } else {
    console.clear();

    console.log('\x1b[33m────────────────────────────\x1b[37m');

    console.log(
      '      \x1b[33m\x1b[1m\x1b[37m⚡ Create Cronos \x1b[0m\x1b[31m'
    );

    console.log(
      '\x1b[33m\x1b[1m\x1b[31m    https://cronosjs.dev\x1b[0m\x1b[31m'
    );

    console.log('\x1b[33m────────────────────────────\x1b[37m');
  }

  const techChoices: { name: string; value: string } | any =
    Config.projects.map((project) => {
      return {
        name: project.name,
        value: project.value,
        description: project.description ? project.description : project.name
      };
    });

  //! PRE-MIDDLEWARE

  for (const step of Config.initializer()) {
    await step();
  }

  //! TECH SELECT

  const { default: autocomplete, Separator } = await import(
    'inquirer-autocomplete-standalone'
  );

  let tech = await autocomplete({
    message: '💻 Select a technology:',
    source: async (input) => {
      let filteredCountries = techChoices.filter((tech) => {
        return tech.name.toLowerCase().includes(input?.toLowerCase());
      });

      if (!input) return techChoices;

      return filteredCountries.map((tech) => {
        return {
          value: tech.value,
          name: `\x1b[0m${tech.name}`,
          description: tech.description
        };
      });
    }
  });

  //! CLONE REPO

  const npx = OS === 'win32' ? 'npx.cmd' : 'npx';

  const npm = OS === 'win32' ? 'npm.cmd' : 'npm';

  const project: Project | undefined = Config.projects.find(
    (project) => project.value === tech
  );

  if (!project) {
    console.log('Project not found');
    process.exit();
  }

  //! PROJECT NAME PROMPT
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const prompt = (question: string) =>
    new Promise((resolve) => rl.question(question, resolve));

  //! PROJECT CREATION

  if (project.type === 'external') {
    let execCommand =
      typeof project.execCommand === 'string'
        ? [project.execCommand]
        : project.execCommand;

    let createApp;

    if (
      Config.projects.find((p) => p.value === tech)?.create === false ||
      !project.create
    ) {
      createApp = spawn(npx, execCommand, {
        stdio: 'inherit'
      });
    } else {
      createApp = spawn(npm, ['create', execCommand], {
        stdio: 'inherit'
      });
    }

    await new Promise((resolve) => {
      createApp.on('exit', resolve);
    });
  } else {
    const name = await prompt('📁 Project name: ');

    fs.mkdirSync(name as string);

    process.chdir(name as string);

    const templateDir = path.join(currentDir, `../templates/${project.path}`);

    const targetDir = process.cwd();

    const write = (file: string, content?: string) => {
      //* Define the target path by joining the target directory and the file name
      const targetPath = path.join(targetDir, file);

      //* Copy the file from the template directory to the target directory
      copy(path.join(templateDir, file), targetPath);
    };

    //* Read the template directory
    const templateData = fs.readdirSync(templateDir);

    //* Loop through each file in the template directory
    for (const fileOrDir of templateData) {
      //! If the file is 'node_modules', skip it
      if (fileOrDir === 'node_modules') continue;

      //! If the file is 'dist', skip it
      if (fileOrDir === 'dist') continue;

      //! If the file is 'package-lock.json', skip iat
      if (fileOrDir === 'package-lock.json') continue;

      //* Write the file to the target directory
      write(fileOrDir);
    }

    const data: Data = {
      name: name as string
    };

    for (const step of project.steps) {
      await step(data);
    }

    //! FINALIZER
    for (const step of Config.finalizer()) {
      await step();
    }
  }
};

main().then(() => process.exit());
