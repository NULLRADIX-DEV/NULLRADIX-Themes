import { cpSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const root = import.meta.dirname;

// Legt manifest.json, theme.css, assets/ und claude/ neben main.js, damit `nullradix theme pack dist` ein vollständiges Paket baut
function copyThemeFiles(): Plugin {
  let outDir = '';
  return {
    name: 'nullradix-theme-files',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      for (const name of ['manifest.json', 'theme.css', 'assets', 'claude']) {
        if (existsSync(join(root, name))) cpSync(join(root, name), join(outDir, name), { recursive: true });
      }
    },
  };
}

export default defineConfig({
  root,
  // Immer die Produktions-JSX-Runtime (react/jsx-runtime), auch wenn der Build aus einem Test mit NODE_ENV=test läuft
  esbuild: { jsx: 'automatic', jsxDev: false },
  plugins: [copyThemeFiles()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Kein public/: das Paket enthält nur, was NULLRADIX lädt
    copyPublicDir: false,
    lib: { entry: 'src/main.tsx', formats: ['es'], fileName: () => 'main.js' },
    rollupOptions: {
      // Kommen zur Laufzeit aus NULLRADIX (Import-Map); nie mitbündeln, sonst laufen zwei Reacts
      external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', '@nullradix/theme-sdk'],
    },
  },
});
