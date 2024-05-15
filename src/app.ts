#!/usr/bin/env node

//! esm
import readline from 'readline';
import fs from 'fs';
import { build } from 'esbuild';


//! commonjs
const path = require('path');
const spawn = require('cross-spawn');
const os = require('os');
const prompts = require('prompts');

//! VARIABLES
const currentDir = __dirname;

const OS = process.platform;

const homeDir = os.homedir();

import('inquirer-autocomplete-standalone');

//! TYPES

import { Project } from '../types/Project';
import { Data } from '../types/Data';

//! Config
import config from '../config/config';
let Config = config;
import yargs from 'yargs';


const systemArgs = process.argv;

const runtime = systemArgs[0].split('/').pop();

if (runtime === 'bun') {
  console.log('In this version, bun is not supported. Please use node instead');
  process.exit(1);
}

const argv = yargs(process.argv.slice(2))
  .options({
    t: { type: 'string', alias: 't' },
    c: { type: 'string', alias: 'c' },
    p: { type: 'string', alias: 'p' },
    l: { type: 'string', alias: 'l' },
  })
  .parseSync();

//* ----------------------------------------------------------------------------------------

import { copy, copyDir } from './functions/copy';
import InitCache from './cache';

/**
 * This function logs a success message to the console after a project has been created successfully.
 * It provides the user with instructions on how to start using the project.
 *
 * @param name - The name of the project. It can be a string or any other type.
 */

//! MAIN
const main = async () => {
  //! CACHE TEMPLATES
  InitCache();

  if (typeof argv.c === 'string') {
    //! INSTALL THE NEW CONFIG
    if (argv.c.length > 0) {
      const configPath = argv.c;

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
        }

        if (!isTS) {
          console.log('Please enter a TypeScript configuration');
        }

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

          //console.log(argv);
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

  if (typeof Config.presentation === 'function') {
    Config.presentation();
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

  let techChoices: { name: string; value: string } | any =
    Config.projects.map((project) => {
      return {
        title: project.name,
        value: project.value
      };
    });

  techChoices = techChoices.map((tech: any, index: number) => {
    tech.id = index + 1;
    return tech;
  });

  //! PRE-MIDDLEWARE

  for (const step of Config.initializer()) {
    await step();
  }

  //! TECH SELECT

  let tech;

  if (argv.p && (argv.p as string).length > 0) {
    tech = argv.p;
  } else {
    tech = await prompts({
      type: 'autocomplete',
      name: 'value',
      limit: () => {
        if (Config.limit) {
          if (Config.limit === 'all') {
            return techChoices.length;
          } else {
            return Config.limit;
          }
        }

        if (argv.l) {
          if (argv.l === 'all') {
            return techChoices.length;
          } else {
            return parseInt(argv.l);
          }
        }

        //! DEFAULT LIMIT
        return 10;
      },
      suggest: (input) => {

        // let results = miniSearch.search(input);

        const filteredCountries = techChoices.filter((tech) => {
          return tech.title.toLowerCase().includes(input.toLowerCase());
        });

        if (!input) return techChoices;

        return filteredCountries.map((tech) => {
          return {
            value: tech.value,
            title: `\x1b[0m${tech.title}`
          };
        });
      },
      message: '💻 Select a technology:',
      choices: techChoices
    });

    tech = tech.value;
  }

  //! CLONE REPO

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
    let execCommand = project.execCommand;

    if (!execCommand) {
      console.log('Project not found');
      process.exit();
    }
    console.log('');

    console.log('Conecting ...');

    const arrExecCommand = execCommand.split(' ');

    spawn.sync(arrExecCommand[0], arrExecCommand.slice(1), {
      stdio: 'inherit'
    });

  } else {
    const name = await prompt('📁 Project name: ');

    rl.close();

    let templateDir = path.join(currentDir, `../templates/${project.path}`);

    if (Config.customTemplateDir) {
      if (fs.existsSync(homeDir + '/.cronos/templates')) {
        templateDir = path.join(homeDir, '.cronos', 'templates', project.path);
      } else {
        console.log('Template not found, using default');
      }
    }

    if (!name) {
      console.log("Please enter a path");
      process.exit(1)
    }

    if (name != "." && name != undefined && name != null) {
      fs.mkdirSync(name as string);
      process.chdir(name as string);
    }

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
