import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

// Verificamos que las variables de entorno estén definidas
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);