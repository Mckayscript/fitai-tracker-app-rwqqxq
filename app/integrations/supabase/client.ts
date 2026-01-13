
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rwklizsezvocgarzprfm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3a2xpenNlenZvY2dhcnpwcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzQ3MTcsImV4cCI6MjA3OTYxMDcxN30.Qjpq-1CGuZyg8Zrseuwd4oNz7caTxbFU7Oqte0ylYy8";

console.log('Initializing Supabase client...');

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase client initialized successfully');
