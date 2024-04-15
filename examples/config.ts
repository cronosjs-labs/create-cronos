import { Config } from '../types/Config';

const config: Config = {
  customTemplateDir: 'myCustomTemplatesDir',
  banner: () => {
    console.clear();

    console.log('\x1b[31m────────────────────────────\x1b[37m');

    console.log(
      '    \x1b[33m\x1b[1m\x1b[33m🦀 Rust Hello World \x1b[0m\x1b[31m'
    );

    console.log(
      '\x1b[33m\x1b[1m\x1b[31m    https://cronosjs.dev\x1b[0m\x1b[31m'
    );

    console.log('\x1b[31m────────────────────────────\x1b[37m');
  },
  projects: [
    {
      name: '\x1b[1m\x1b[33mRust Hello World\x1b[37m\x1b[0m',
      value: 'rustHelloWorld',
      type: 'local',
      path: 'helloWorld',
      steps: []
    }
  ],
  initializer: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  },
  finalizer: () => {
    return [() => console.log("🚀 Let's go! 🚀")];
  }
};

export default config;
