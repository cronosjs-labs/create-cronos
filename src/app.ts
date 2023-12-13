#!/usr/bin/env node

//! esm
import git from 'simple-git';
import readline from 'readline';
import checkbox, { Separator } from '@inquirer/checkbox';
import select from '@inquirer/select';
import fs from 'fs';
import { cronosUserRepository } from './functions/Cronos-User-Repository-Choices.js';
import { cronosUserRepositoryGenerate } from './functions/Cronos-User-Repository-Generate.js';
import { installDependencies } from './functions/installDependencies.js';
import { confirm } from '@inquirer/prompts';

//! commonjs
const path = require('path');

//! PACKAGES
import reactChoices from './packages/react-choices.js';
import expressChoices from './packages/express-choices.js';

//! VARIABLES
const currentDir = __dirname;
const os = process.platform;

//! ARGS
const args = process.argv.slice(2);
const canary = args.includes('--canary');

//! PRINT LETTERS
console.clear();

console.log('\x1b[33m────────────────────────────\x1b[37m');

canary
  ? console.log(
      '      \x1b[33m\x1b[1m\x1b[37mCronos Canary 🟡  \x1b[0m\x1b[31m'
    )
  : console.log('           \x1b[33m\x1b[1m\x1b[37mCronos 🔥  \x1b[0m\x1b[31m');

//log github
console.log('\x1b[33m\x1b[1m\x1b[31m    https://cronosjs.dev\x1b[0m\x1b[31m');

console.log('\x1b[33m────────────────────────────\x1b[37m');

//* ----------------------------------------------------------------------------------------

/**
 * Copies a directory from a source to a destination.
 *
 * @param {string} srcDir - The source directory to copy from.
 * @param {string} destDir - The destination directory to copy to.
 */

const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
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
    if (src.includes('_gitignore')) {
      const newDest = dest.replace('_', '.');
      fs.copyFileSync(src, newDest);
    } else {
      fs.copyFileSync(src, dest);
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
  const techChoices: { name: string; value: string } | any = [
    {
      name: '\x1b[1m\x1b[36mReact\x1b[37m\x1b[0m',
      value: 'react'
    }
  ];

  if (canary) {
    techChoices.push({
      name: '\x1b[1m\x1b[33mExpress\x1b[37m\x1b[0m',
      value: 'express'
    });

    techChoices.push({
      name: '\x1b[1m\x1b[32mVue\x1b[37m\x1b[0m',
      value: 'vue'
    });

    techChoices.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (b.name > a.name) return 1;
      return 0;
    });

    techChoices.push(new Separator());

    techChoices.push({
      name: '\x1b[1m\x1b[40m🛸 Cronos User Repository\x1b[37m\x1b[0m',
      value: 'cronos-user-repository'
    });
  } else {
    techChoices.push({
      name: 'Express (TypeScript)',
      value: 'express-typescript'
    });
  }

  //! TECH SELECT

  let cronos_user_repository = false;
  let cronos_user_repository_extra: null | string = null;

  let tech = await select({
    message: '💻 Select a technology:',
    choices: techChoices
  });

  if (tech === 'cronos-user-repository') {
    const data = await cronosUserRepository();
    tech = data.tech;
    cronos_user_repository_extra = data.extra || null;
    cronos_user_repository = true;
  }

  //! PROJECT NAME
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const prompt = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  const name: string | unknown = await prompt('  💡 Project name: ');

  const route = name === '.' ? '.' : `./${name}`;

  if (name !== '.') {
    fs.mkdirSync(route);
    process.chdir(route);
  }

  //! EXTRA PACKAGES

  const extraPackages: string[] | null =
    (await tech) == 'react' ||
    (canary && cronos_user_repository_extra == 'react')
      ? await checkbox({
          message: '📦 Select extra packages:',
          choices: reactChoices
        })
      : (canary && tech == 'express') ||
          (canary && cronos_user_repository_extra == 'express')
        ? await checkbox({
            message: '📦 Select extra packages:',
            choices: expressChoices
          })
        : tech == 'express-typescript' ||
            (canary && cronos_user_repository_extra == 'express-typescript')
          ? await checkbox({
              message: '📦 Select extra packages:',
              choices: expressChoices
            })
          : (canary && tech == 'react-typescript') ||
              (canary && cronos_user_repository_extra == 'react-typescript')
            ? await checkbox({
                message: '📦 Select extra packages:',
                choices: reactChoices
              })
            : null;

  //! CLONE REPO
  try {
    if (canary && !cronos_user_repository) {
      //* Define the template directory
      const templateDir = path.join(currentDir, `../templates/${tech}`);

      //* Define the target directory
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

        //! If the file is 'package-lock.json', skip iat
        if (fileOrDir === 'package-lock.json') continue;

        //* Write the file to the target directory
        write(fileOrDir);
      }
    } else if (canary && cronos_user_repository) {
      if (typeof tech !== 'string') {
        console.log('  😨 An error occurred while creating the project.\n');
        process.exit(1);
      } else {
        await cronosUserRepositoryGenerate(tech);
      }
    } else {
      await git().clone(`https://github.com/cronos-js/cronos.${tech}`, '.');
    }
  } catch (error) {
    console.log(error);
    console.log('  😨 An error occurred while creating the project.\n');
  }

  await installDependencies(extraPackages, name);
};

main();
