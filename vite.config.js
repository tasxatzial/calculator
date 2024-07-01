import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';
import path from 'path';

export default defineConfig({
  root: "src",
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      plugins: [
          license({
          thirdParty: {
              includePrivate: true,
              output: {
                file: path.join(__dirname, 'dist', 'dependencies.txt'),
              },
            },
          }),
        ],
    },
  },
});
