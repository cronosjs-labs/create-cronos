import { expressTsTransform } from './steps/expressTsTransform';
import { Config } from './types/Config';

const config: Config = {
  banner: () => {
    console.clear();

    console.log('\x1b[33m────────────────────────────\x1b[37m');

    console.log(
      '      \x1b[33m\x1b[1m\x1b[37m⚡ Create Cronos \x1b[0m\x1b[31m'
    );

    console.log(
      '\x1b[33m\x1b[1m\x1b[31m    https://cronosjs.dev\x1b[0m\x1b[31m'
    );

    console.log('\x1b[33m────────────────────────────\x1b[37m');
  },
  projects: [
    {
      name: '\x1b[1m\x1b[35mVite ↗\x1b[37m\x1b[0m',
      value: 'vite',
      type: 'external',
      execCommand: 'create-vite@latest',
      steps: []
    },
    {
      name: '\x1b[1m\x1b[35mVitepress ↗\x1b[37m\x1b[0m',
      value: 'vitepress',
      type: 'external',
      execCommand: ['vitepress', 'init'],
      steps: []
    },
    {
      name: '\x1b[1m\x1b[33mAstro ↗\x1b[37m\x1b[0m',
      value: 'astro',
      type: 'external',
      execCommand: 'create-astro@latest',
      steps: []
    },
    {
      name: '\x1b[1m\x1b[33mStarlight ↗\x1b[37m\x1b[0m',
      value: 'starlight',
      type: 'external',
      execCommand: ['create-astro@latest', '--template', 'starlight'],
      steps: []
    },
    {
      name: '\x1b[1m\x1b[37mNext.js ↗\x1b[37m\x1b[0m',
      value: 'next',
      type: 'external',
      execCommand: 'create-next-app@latest',
      steps: []
    },
    {
      name: '\x1b[1m\x1b[31mHono ↗\x1b[37m\x1b[0m',
      value: 'hono',
      type: 'external',
      execCommand: 'create-hono@latest',
      steps: []
    },
    {
      name: '\x1b[1m\x1b[36mExpress\x1b[37m\x1b[0m',
      value: 'express',
      type: 'local',

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
      type: 'local',
      path: 'express',
      steps: [
        () => {
          console.log('Creating a new Express project with Typescript');
        },
        expressTsTransform,
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
      name: '\x1b[1m\x1b[32mAngular\x1b[37m\x1b[0m',
      value: 'angular',
      type: 'external',
      execCommand: ['@angular/cli', 'new'],
      steps: []
    }
  ],
  initializer: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  },
  finalizer: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  }
};

export default config;
