import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Prevent creating multiple instances during development
export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseAnonKey || 'dummy-key');
