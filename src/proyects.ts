import { Project } from '../types/Proyect';

const vite: Project = {
  name: '\x1b[1m\x1b[35mVite ↗\x1b[37m\x1b[0m',
  value: 'vite',
  type: 'external',
  body: {
    execCommand: 'create-vite@latest'
  },
  steps: [() => console.log("🚀 Let's go! 🚀")]
};

const next: Project = {
  name: '\x1b[1m\x1b[37mNext.js ↗\x1b[37m\x1b[0m',
  value: 'next',
  type: 'external',
  body: {
    execCommand: 'create-next-app@latest'
  },
  steps: [() => console.log("🚀 Let's go! 🚀")]
};

const vitepress: Project = {
  name: '\x1b[1m\x1b[34mVitePress ↗\x1b[37m\x1b[0m',
  value: 'vitepress',
  type: 'external',
  body: {
    execCommand: 'vitepress init'
  },
  steps: [() => console.log("🚀 Let's go! 🚀")]
};

const express: Project = {
  name: '\x1b[1m\x1b[36mExpress\x1b[37m\x1b[0m',
  value: 'express',
  type: 'local',
  body: {
    path: 'express'
  },
  steps: [() => console.log("🚀 Let's go! 🚀")]
};

const projects: Project[] = [vite, next, vitepress, express];

export { projects };
