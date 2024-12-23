import { createClient } from '@supabase/supabase-js'

let supabaseUrl;
let supabaseKey;

// Verificamos que las variables de entorno estén definidas
if (typeof Cypress !== 'undefined') {
    // Durante las pruebas de Cypress
    supabaseUrl = Cypress.env('SUPABASE_URL');
    supabaseKey = Cypress.env('SUPABASE_ANON_KEY');
  } else {
    // En tiempo de ejecución de la aplicación
    supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
  }

export const supabase = createClient(supabaseUrl, supabaseKey);