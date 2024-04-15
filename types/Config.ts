import { Project } from './Project';
import { Middleware } from './Middleware';

interface Config {
  banner: () => void;
  projects: Project[];
  initializer: Middleware;
  finalizer: Middleware;
  customTemplateDir?: string;
}

export { Config };
