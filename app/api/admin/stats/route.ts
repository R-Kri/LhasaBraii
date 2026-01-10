import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Helper to check if user is admin
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    
    return profile?.role === 'admin';
}

// GET - Fetch admin dashboard stats
export async function GET() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!(await isAdmin(supabase, user.id))) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        // Get book counts by status
        const { data: books } = await supabase
            .from('books')
            .select('status');

        const bookCounts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            sold: 0,
            total: 0,
        };

        if (books) {
            books.forEach((book: { status: string }) => {
                bookCounts.total++;
                if (book.status in bookCounts) {
                    bookCounts[book.status as keyof typeof bookCounts]++;
                }
            });
        }

        // Get user count
        const { count: userCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });

        // Get order counts
        const { data: orders } = await supabase
            .from('orders')
            .select('status');

        const orderCounts = {
            initiated: 0,
            buyer_confirmed: 0,
            completed: 0,
            cancelled: 0,
            total: 0,
        };

        if (orders) {
            orders.forEach((order: { status: string }) => {
                orderCounts.total++;
                if (order.status in orderCounts) {
                    orderCounts[order.status as keyof typeof orderCounts]++;
                }
            });
        }

        // Get recent moderation logs
        const { data: recentLogs } = await supabase
            .from('moderation_logs')
            .select(`
                id,
                action,
                book_id,
                notes,
                created_at,
                moderator:profiles!moderation_logs_moderator_id_fkey (
                    full_name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            success: true,
            data: {
                books: bookCounts,
                users: userCount || 0,
                orders: orderCounts,
                recentActivity: recentLogs || [],
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process request',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
