interface Project {
  name: string;
  value: string;
  type: 'local' | 'external';
  body?: Body;
  requestProjectName?: boolean;
  steps: Function[];
  path?: string;
  execCommand?: string | string[];
}

export { Project };
