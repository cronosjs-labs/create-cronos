import { expressTSTransform } from "express-ts-transform";
//import { Config } from '../types/Config';
import fs from 'fs';
import path from "path";
import { Config } from "../types/Config";

const packageJsonPath = path.resolve(__dirname, '../package.json');
const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')).version;

const config: Config = {
  //limit: 10,
  presentation: () => {
    console.clear();

    console.log('\x1b[33m────────────────────────────\x1b[37m');

    console.log(
      '      \x1b[33m\x1b[1m\x1b[37m⚡ Create Cronos \x1b[0m\x1b[31m'
    );

    console.log(
      '\x1b[33m\x1b[1m\x1b[31m    https://cronosjs.dev\x1b[0m\x1b[31m'
    );

    console.log('\x1b[33m────────────────────────────\x1b[37m');

    console.log("\x1b[1m\x1b[31m                    v" + version + "\x1b[0m");
  },
  initializer: () => {
    return [() => null];
  },
  projects: {
    local: [
      {
        name: '\x1b[1m\x1b[36mExpress\x1b[37m\x1b[0m',
        value: 'express',

        path: 'express',
        steps: [
          () =>
            console.log(`
            To get started:
            1. cd <project-name>
            2. npm install
            3. npm run dev
          `)
        ]
      },
      {
        name: '\x1b[1m\x1b[36mExpress Typescript\x1b[37m\x1b[0m',
        value: 'express-ts',

        path: 'express',
        steps: [
          () => {
            console.log('Creating a new Express project with Typescript');
          },
          () => expressTSTransform(process.cwd()),
          () =>
            console.log(`
            To get started:
            1. cd <project-name>
            2. npm install
            3. npm run dev
          `)
        ]
      },
    ],
    external: [
      {
        name: '\x1b[1m\x1b[35mVite ↗\x1b[37m\x1b[0m',
        value: 'vite',
        description:
          'Build tool that aims to provide a faster and leaner development experience for modern web projects.',
        //! Bibliography: //* https://vitejs.dev/
        execCommand: 'npm create vite@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[33mAstro ↗\x1b[37m\x1b[0m',
        value: 'astro',
        execCommand: 'npm create astro@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[37mNext.js ↗\x1b[37m\x1b[0m',
        value: 'next',
        execCommand: 'npm create next-app@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[31mHono ↗\x1b[37m\x1b[0m',
        value: 'hono',
        execCommand: 'npm create hono@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[36mRsbuild ↗\x1b[37m\x1b[0m',
        value: 'rsbuild',
        execCommand: "npm create rsbuild@latest",
        steps: []
      },
      {
        name: '\x1b[1m\x1b[31mRspack ↗\x1b[37m\x1b[0m',
        value: 'rspack',
        execCommand: "npm create rspack@latest",
        steps: []
      },

      {
        name: '\x1b[1m\x1b[32mAngular ↗\x1b[37m\x1b[0m',
        value: 'angular',
        execCommand: 'npx @angular/cli new',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[33mTauri ↗\x1b[37m\x1b[0m',
        value: 'tauri',
        execCommand: 'npm create tauri-app@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[36mQuik ↗\x1b[37m\x1b[0m',
        value: 'quik',
        execCommand: 'npm create qwik@latest',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[35mVitepress ↗\x1b[37m\x1b[0m',
        value: 'vitepress',
        execCommand: 'npx vitepress init',
        steps: []
      },
      {
        name: '\x1b[1m\x1b[33mStarlight ↗\x1b[37m\x1b[0m',
        value: 'starlight',
        execCommand: 'npm create astro@latest --template starlight',
        steps: []
      },
    ],
  },
  finalizer: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  }
};

export default config;
