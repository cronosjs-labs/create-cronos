import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const config = [
  {
    input: "src/main.ts",
    output: {
      file: "lib/main.esm.js",
      format: "es",
      sourcemap: true,
      exports: "auto",
    },
    plugins: [typescript(), terser()],
  },
  {
    input: "src/main.ts",
    output: {
      file: "lib/main.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
    plugins: [typescript(), terser()],
  },
];

export default config;
