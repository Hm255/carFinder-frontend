import { defineConfig } from "cypress";
import viteConfig from './vite.config';
import { mergeConfig } from 'vite';
import { CypressEsm } from '@cypress/vite-plugin-cypress-esm';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    
    },
  },
});

