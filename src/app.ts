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

//! PRINT LETTERS
console.clear();

console.log('\x1b[33m────────────────────────────\x1b[37m');

console.log('           \x1b[33m\x1b[1m\x1b[37mCronos 🔥  \x1b[0m\x1b[31m');

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
      name: '\x1b[1m\x1b[35mVite ↗\x1b[37m\x1b[0m',
      value: 'vite'
    },
    {
      name: '\x1b[1m\x1b[37mNext.js ↗\x1b[37m\x1b[0m',
      value: 'next'
    },
    {
      name: '\x1b[1m\x1b[36mExpress\x1b[37m\x1b[0m',
      value: 'express'
    }
  ];

  //! TECH SELECT

  let tech = await select({
    message: '💻 Select a technology:',
    choices: techChoices
  });

  console.log("\n  🚀 Let's go! 🚀\n");

  //! CLONE REPO

  const npx = os === 'win32' ? 'npx.cmd' : 'npx';

  if (tech === 'vite') {
    const createViteApp = spawn(npx, ['create-vite@latest'], {
      stdio: 'inherit'
    });

    return new Promise((resolve) => {
      createViteApp.on('exit', resolve);
    });
  } else if (tech === 'next') {
    const createNextApp = await spawn(npx, ['create-next-app@latest'], {
      stdio: 'inherit'
    });

    return new Promise((resolve) => {
      createNextApp.on('exit', resolve);
    });
  } else if (tech === 'express') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const prompt = (question: string) =>
      new Promise((resolve) => rl.question(question, resolve));

    const name = await prompt('📁 Project name: ');

    fs.mkdirSync(name as string);

    process.chdir(name as string);

    const templateDir = path.join(currentDir, `../templates/${tech}`);

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
  }
};

main().then(() => process.exit());
