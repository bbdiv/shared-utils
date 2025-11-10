import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'shared-utils.js',
      formats: ['system']
    },
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    port: 5173,
    strictPort: true,
    cors: true
  }
});