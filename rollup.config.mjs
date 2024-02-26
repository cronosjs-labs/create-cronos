// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/app.ts',
  output: {
    file: 'bin/app.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};
