import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://svdbmoozphbivdvdmlfu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  "sb_publishable_ThrfnIRx5NNAaV-xLkVftg_McfWpTMh";

function createBrowserClient() {
  // Browser: use localStorage so sessions persist across page reloads/navigation
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "ts-auth-token",
    },
  });
}

function createSsrClient() {
  // SSR: no localStorage, no persistence — session hydrates from browser on mount
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// Keep separate singleton instances for SSR vs browser environments.
// This is the key fix: the SSR (no-storage) client must NEVER be reused
// in the browser, which was causing the auto-logout after login.
let _browserClient: ReturnType<typeof createBrowserClient> | undefined;
let _ssrClient: ReturnType<typeof createSsrClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop, receiver) {
    if (typeof window !== 'undefined') {
      // Always use the browser client with localStorage on the client side
      if (!_browserClient) _browserClient = createBrowserClient();
      return Reflect.get(_browserClient, prop, receiver);
    } else {
      // SSR environment — no localStorage available
      if (!_ssrClient) _ssrClient = createSsrClient();
      return Reflect.get(_ssrClient, prop, receiver);
    }
  },
});
