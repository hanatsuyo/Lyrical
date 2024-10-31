import { getSupabase } from "./supabase";

export const checkExistingUser = async (email: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("mail", email)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }
  console.log(data);
  return data;
};
