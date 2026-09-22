import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import type { Database } from './database.types';

/**
 * URL e chave publicável são públicas por definição — quem protege os dados é
 * o RLS, não o segredo da chave. São as mesmas do Prism web, de propósito: os
 * dois clientes falam com o mesmo banco e enxergam exatamente o mesmo estado.
 */
const SUPABASE_URL = 'https://asdjbedpqowzdppboxyy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-HHHeglSbJkf2qSzLltnLA_woa7wDyk';

/**
 * A sessão vive no AsyncStorage, não em cookie: o app não tem navegador para
 * guardar um, e `detectSessionInUrl` só faz sentido em redirecionamento web.
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { SUPABASE_URL };
