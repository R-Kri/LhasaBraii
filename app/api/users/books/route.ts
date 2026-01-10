import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET current user's books
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const supabase = await createClient();

        // Get authenticated user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Query parameters
        const status = searchParams.get('status') || ''; // pending, approved, rejected, sold
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
        const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));
        const sortBy = searchParams.get('sortBy') || 'created_at'; // created_at, price, title

        let query = supabase
            .from('books')
            .select('*', { count: 'exact' })
            .eq('seller_id', user.id);

        // Filter by status if provided
        if (status && ['pending', 'approved', 'rejected', 'sold'].includes(status)) {
            query = query.eq('status', status);
        }

        // Sorting
        if (sortBy === 'price') {
            query = query.order('price', { ascending: true });
        } else if (sortBy === 'title') {
            query = query.order('title', { ascending: true });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to fetch books',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: offset + limit < (count || 0),
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
