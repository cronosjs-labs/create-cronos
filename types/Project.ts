interface Project {
  name: string;
  value: string;
  type: 'local' | 'external';
  steps: Function[];
  path?: string;
  execCommand?: string | string[];
}

export { Project };
