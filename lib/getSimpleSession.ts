import { supabaseServer } from "@/lib/supabase";

export async function getSimpleSession() {
  const supabase = supabaseServer();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, isLoggedIn: false };
  }

  const md = user.user_metadata ?? {};

  const role = md.role || "student";
  const firstName = md.firstName || null;
  const lastName = md.lastName || null;

  const name =
    (firstName || lastName)
      ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
      : user.email ?? "";

  return {
    user: {
      id: user.id,
      email: user.email,
      role,
      firstName,
      lastName,
      name,
    },
    isLoggedIn: true,
  };
}
