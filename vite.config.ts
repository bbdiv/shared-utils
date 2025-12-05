import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@axios': '/src/axios/index.ts',
      '@axios/': '/src/axios/'
    }
  },
  // Define process.env polyfill for browser compatibility
  // This replaces process.env references at build time to prevent "process is not defined" errors
  // when using React components that reference process.env.NODE_ENV
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env': JSON.stringify({ NODE_ENV: process.env.NODE_ENV || 'production' })
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'singleSpa.js',
      formats: ['system']
    },
    outDir: 'dist',
    target: 'esnext',
    rollupOptions: {
      external: ['react'],
      // Inject process global variable at the beginning of the bundle
      // This provides a runtime polyfill for process.env when code accesses process directly
      output: {
        intro: `var process = { env: { NODE_ENV: ${JSON.stringify(process.env.NODE_ENV || 'production')} } };`
      }
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