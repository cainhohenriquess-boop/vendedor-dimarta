import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Variaveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY nao configuradas.",
    );
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}

export const createClient = async (
  cookieStore?: Awaited<ReturnType<typeof cookies>>,
) => {
  const { supabaseUrl: url, supabaseKey: key } = getSupabaseConfig();
  const resolvedCookieStore = cookieStore ?? (await cookies());

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return resolvedCookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            resolvedCookieStore.set(name, value, options);
          });
        } catch {
          // Server Components nem sempre conseguem persistir cookies.
          // Nesses casos o middleware cuida da atualizacao da sessao.
        }
      },
    },
  });
};
