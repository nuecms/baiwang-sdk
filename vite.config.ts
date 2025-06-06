import { defineConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

// Vite configuration for library development
export default defineConfig({
  plugins: [tsconfigPaths(), dts({
    insertTypesEntry: true,
    rollupTypes: true
  })], // Use TypeScript paths plugin
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Entry point for the library
      name: 'BaiwangSDK',                            // Global variable for UMD build
      formats: ['es', 'cjs'],                 // Output formats
      fileName: (format) => {
        return format === 'es' ? 'index.esm.js' : 'index.js';
      }
    },
    rollupOptions: {
      external: [
        'ioredis',
        'cross-fetch',
        '@nuecms/sdk-builder',
        'crypto',
        'util'
      ], // Mark dependencies as external
      output: {
        globals: {
          'cross-fetch': 'fetch',           // Use fetch in the browser
          'ioredis': 'Redis',               // Global for Redis in Node.js
        },
      },
    },
    sourcemap: false,                           // Enable source maps for debugging
    emptyOutDir: true,                         // Clean output directory before building
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@enums': path.resolve(__dirname, 'src/enums'),
    },
  }
});
