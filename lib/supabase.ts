import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// CLIENT — para componentes con "use client"
export const supabaseClient = () => {
  return createClientComponentClient();
};

// SERVER — para layouts, pages, API routes
export const supabaseServer = () => {
  return createServerComponentClient({ cookies });
};
