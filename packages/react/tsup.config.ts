import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  external: ['react', 'react-dom', '@switchboard-js/core', '@switchboard-js/devtools'],
});
