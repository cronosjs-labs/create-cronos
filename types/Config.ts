import { Project } from './Project';
import { Middleware } from './Middleware';

interface Config {
  projects: Project[];
  preMiddleware: Middleware;
  postMiddleware: Middleware;
}

export { Config };
