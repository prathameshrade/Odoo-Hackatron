import { defineConfig } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export default defineConfig({
  plugins: [googleAI()],
  generators: {
    default: {
      provider: 'googleai',
      model: 'gemini-2.0-flash',
    },
  },
});