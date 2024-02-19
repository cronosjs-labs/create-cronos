// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/app.ts',
  output: {
    file: 'bin/app.cjs',
    format: 'cjs'
  },
  plugins: [typescript()]
};
