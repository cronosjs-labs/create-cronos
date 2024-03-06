// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/app.ts',
  output: {
    file: 'bin/app.js',
    format: 'cjs'
  },
  plugins: [typescript(), terser()]
};
