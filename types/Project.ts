interface Project {
  name: string;
  value: string;
  description?: string;
  type: 'local' | 'external';
  steps: Function[];
  path?: string;
  execCommand?: string;
  create?: boolean;
}

export { Project };
