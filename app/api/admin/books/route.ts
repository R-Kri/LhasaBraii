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

// GET - Fetch books for moderation (pending, or all with filters)
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'pending';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        if (!(await isAdmin(supabase, user.id))) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        // Build query - fetch books without join first, then get seller info
        let query = supabase
            .from('books')
            .select(`
                id,
                seller_id,
                title,
                author,
                isbn,
                description,
                category,
                condition,
                price,
                images,
                status,
                created_at,
                updated_at
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // Filter by status
        if (status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: books, error, count } = await query;

        if (error) {
            console.error('Admin books fetch error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch books', details: error.message },
                { status: 500 }
            );
        }

        // Fetch seller info for all books
        let booksWithSeller = books || [];
        if (books && books.length > 0) {
            const sellerIds = [...new Set(books.map(b => b.seller_id))];
            const { data: sellers } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .in('id', sellerIds);

            const sellerMap = new Map(sellers?.map(s => [s.id, s]) || []);
            booksWithSeller = books.map(book => ({
                ...book,
                seller: sellerMap.get(book.seller_id) || null
            }));
        }

        // Get counts by status
        const { data: statusCounts } = await supabase
            .from('books')
            .select('status')
            .then(async ({ data }) => {
                const counts = {
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    sold: 0,
                    all: 0,
                };
                if (data) {
                    data.forEach((book: { status: string }) => {
                        counts.all++;
                        if (book.status in counts) {
                            counts[book.status as keyof typeof counts]++;
                        }
                    });
                }
                return { data: counts };
            });

        return NextResponse.json({
            success: true,
            data: booksWithSeller,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
            counts: statusCounts,
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
