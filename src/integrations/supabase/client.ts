// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dntmjzqofaxkagvnitav.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudG1qenFvZmF4a2Fndm5pdGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTc5MzUsImV4cCI6MjA1OTY3MzkzNX0.A3DII2XxQCXoHv9Ax5j4fsygppmdg5IZ1Aon18Kft2M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);