#!/usr/bin/env node

//! esm
import readline from 'readline';
import select from '@inquirer/select';
import fs from 'fs';

//! commonjs
const path = require('path');
const { spawn } = require('child_process');

//! VARIABLES
const currentDir = __dirname;
const os = process.platform;

//! TYPES

import { Project } from '../types/Project';
import { Data } from '../types/Data';

//! CONFIG
import config from '../config';

//! PROJECTS & MIDDLEWARE
const { projects, initializer, finalizer } = config;

//! PRINT LETTERS
console.clear();

console.log('\x1b[33m────────────────────────────\x1b[37m');

console.log('      \x1b[33m\x1b[1m\x1b[37m⚡ Create Cronos \x1b[0m\x1b[31m');

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
  const techChoices: { name: string; value: string } | any = projects.map(
    (project) => {
      return {
        name: project.name,
        value: project.value
      };
    }
  );

  //! PRE-MIDDLEWARE

  for (const step of initializer()) {
    await step();
  }

  //! TECH SELECT

  let tech = await select({
    message: '💻 Select a technology:',
    choices: techChoices
  });

  //! CLONE REPO

  const npx = os === 'win32' ? 'npx.cmd' : 'npx';

  const project: Project | undefined = projects.find(
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
    const execCommand =
      typeof project.execCommand === 'string'
        ? [project.execCommand]
        : project.execCommand;

    const createApp = spawn(npx, execCommand, {
      stdio: 'inherit'
    });

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

    //! POST-MIDDLEWARE

    for (const step of finalizer()) {
      await step();
    }

    const data: Data = {
      name: name as string
    };

    for (const step of project.steps) {
      await step(data);
    }
  }
};

main().then(() => process.exit());
