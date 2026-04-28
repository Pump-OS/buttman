import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true, port: 5177 },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: 'index.html',
        memes: 'memes.html'
      }
    }
  }
});
