// lib/supabase.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;


// Create a Supabase client instance
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
