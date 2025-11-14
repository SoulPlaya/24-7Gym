import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xnoycattompjsmtciyre.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY


export const supabase = createClient(supabaseUrl, supabaseKey, { auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
});