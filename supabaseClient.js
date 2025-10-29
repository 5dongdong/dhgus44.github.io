
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ccdvaagodjoxdcnoqikz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjZHZhYWdvZGpveGRjbm9xaWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Mjk3MTQsImV4cCI6MjA3NjAwNTcxNH0.TpgO1Bm7F6k_tuUtOqh6CPy85_w2GyU5LnHSq3uzteA'; // Project Settings → API → anon public 키!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
