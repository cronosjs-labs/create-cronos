type LocalProject = {
  path: string;
};

type ExternalProject = {
  execCommand: string;
};

interface Project {
  name: string;
  value: string;
  type: 'local' | 'external';
  body: LocalProject | ExternalProject;
  steps: Function[];
}

export { Project };
