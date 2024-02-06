type Body = {
  path?: string;
  execCommand?: string;
};

interface Project {
  name: string;
  value: string;
  type: 'local' | 'external';
  body: Body;
  steps: Function[];
}

export { Project };
