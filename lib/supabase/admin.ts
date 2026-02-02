import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Admin client with service role key - bypasses RLS
// Use this only for server-side operations that need to access data across users
export function createAdminClient(): SupabaseClient | null {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.warn('Missing SUPABASE_SERVICE_ROLE_KEY - admin client not available');
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
