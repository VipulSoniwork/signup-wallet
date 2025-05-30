
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ezgyntqshlcwwjtfcgmi.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY;

// Create a Supabase client with the service role key
// This allows bypassing RLS policies for server-side operations
export const supabase = createClient(supabaseUrl, supabaseKey)