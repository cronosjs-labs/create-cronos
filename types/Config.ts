import { Project } from './Project';
import { Middleware } from './Middleware';

interface Config {
  projects: Project[];
  initializer: Middleware;
  finalizer: Middleware;
}

export { Config };
