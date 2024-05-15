import { Project } from './Project';
import { Middleware } from './Middleware';

interface externalProject extends Project {
  execCommand?: string;
}

interface localProject extends Project {
  path?: string;
}

interface Config {
  customTemplateDir?: string;
  presentation: () => void;
  projects: {
    local?: localProject[],
    external?: externalProject[]
  }
  initializer: Middleware;
  finalizer: Middleware;
  limit?: number | 'all';
}

export { Config };
