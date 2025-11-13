import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'singleSpa.js',
      formats: ['system']
    },
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      external: ['react']
    }
  },
  server: {
    port: 3015,
    strictPort: true,
    cors: true
  },
  preview: {
    port: 3015,
    strictPort: true
  }
});