import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import stdLibBrowser from 'node-stdlib-browser';
import { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      ...stdLibBrowser,
      fs: path.resolve(__dirname, 'src', 'dummy-fs.ts'),
      crypto: 'crypto-browserify',
      process: resolve(process.cwd(), 'node_modules', 'process', 'browser.js'),
      'process/': resolve(process.cwd(), 'node_modules', 'process', 'browser.js'),
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills(),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }) as any,
      ]
    }
  }
});