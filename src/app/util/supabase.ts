// utils/supabase.js

import { createClient } from "@supabase/supabase-js";

const getSupabase = (
  options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
) => {
  if (!process.env.SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    options
  );
  return supabase;
};

export { getSupabase };
