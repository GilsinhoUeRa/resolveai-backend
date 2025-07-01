// vitest.config.js
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv'

dotenv.config();

export default defineConfig({
  test: {
    // A linha mais importante: aponta para o nosso arquivo de setup.
    setupFiles: ['./tests/setup.js'],
  },
});