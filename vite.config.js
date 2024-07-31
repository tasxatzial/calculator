import { defineConfig } from 'vite';

export default defineConfig({
  root: "src",
  base: "/calculator/",
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    assetsInlineLimit: 0,
  },
  test: {
    include: ['../tests/**/*.test.js'],
    coverage: {
      enabled: true,
      reportsDirectory: "../coverage",
      reporter: ['html']
    },
  }
});
