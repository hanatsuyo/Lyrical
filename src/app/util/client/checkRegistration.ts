import { getSupabase } from "@/app/util/server/supabase";

export const checkRegistration = async (email: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("mail", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return data;
};
