import { Project } from './types/Proyect';
import { Middleware } from './types/Middleware';

interface Config {
  projects: Project[];
  middleware: Middleware;
}

const config: Config = {
  projects: [
    {
      name: '\x1b[1m\x1b[35mVite ↗\x1b[37m\x1b[0m',
      value: 'vite',
      type: 'external',
      body: {
        execCommand: 'create-vite@latest'
      },
      steps: []
    },

    {
      name: '\x1b[1m\x1b[33mAstro ↗\x1b[37m\x1b[0m',
      value: 'astro',
      type: 'external',
      body: {
        execCommand: 'create-astro@latest'
      },
      steps: []
    },

    {
      name: '\x1b[1m\x1b[37mNext.js ↗\x1b[37m\x1b[0m',
      value: 'next',
      type: 'external',
      body: {
        execCommand: 'create-next-app@latest'
      },
      steps: []
    },

    {
      name: '\x1b[1m\x1b[31mHono ↗\x1b[37m\x1b[0m',
      value: 'hono',
      type: 'external',
      body: {
        execCommand: 'create-hono@latest'
      },
      steps: []
    },

    {
      name: '\x1b[1m\x1b[36mExpress\x1b[37m\x1b[0m',
      value: 'express',
      type: 'local',
      body: {
        path: 'express'
      },
      steps: [
        () =>
          console.log(`
          To get started:
          1. cd <project-name>
          2. npm install
          3. npm run dev
        `)
      ]
    }
  ],
  middleware: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  }
};

export default config;