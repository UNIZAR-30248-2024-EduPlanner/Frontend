import dotenv from 'dotenv';

dotenv.config(); // Carga el archivo .env

export default {
  env: {
    SUPABASE_URL: process.env.VITE_REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.VITE_REACT_APP_SUPABASE_ANON_KEY,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
};
