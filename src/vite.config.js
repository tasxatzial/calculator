import { defineConfig } from 'vite';
import license from 'rollup-plugin-license';
import path from 'path';

export default defineConfig({
    build: {
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
