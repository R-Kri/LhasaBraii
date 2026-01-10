import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET reviews for a book
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        // Query parameters
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
        const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));

        const supabase = await createClient();

        // Check if book exists
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id')
            .eq('id', id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Fetch reviews with pagination
        const { data: reviews, count, error } = await supabase
            .from('reviews')
            .select('id, rating, comment, created_at, reviewer_id, reviewer:reviewer_id(first_name, last_name)', { count: 'exact' })
            .eq('book_id', id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to fetch reviews',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        // Calculate rating stats
        const { data: stats } = await supabase
            .from('reviews')
            .select('rating')
            .eq('book_id', id);

        const ratingStats = {
            averageRating: 0,
            totalReviews: count || 0,
            distribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
            },
        };

        if (stats && stats.length > 0) {
            const sum = stats.reduce((acc, r) => acc + r.rating, 0);
            ratingStats.averageRating = Math.round((sum / stats.length) * 10) / 10;

            stats.forEach((r) => {
                ratingStats.distribution[r.rating as keyof typeof ratingStats.distribution]++;
            });
        }

        return NextResponse.json({
            success: true,
            data: reviews || [],
            stats: ratingStats,
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

// POST to create a review
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { rating, comment } = body;

        // Validate inputs
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be a number between 1 and 5' },
                { status: 400 }
            );
        }

        if (comment && typeof comment !== 'string') {
            return NextResponse.json(
                { error: 'Comment must be a string' },
                { status: 400 }
            );
        }

        if (comment && comment.trim().length === 0) {
            return NextResponse.json(
                { error: 'Comment cannot be empty' },
                { status: 400 }
            );
        }

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

        // Get book and seller_id
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, seller_id')
            .eq('id', id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // User cannot review their own book
        if (book.seller_id === user.id) {
            return NextResponse.json(
                { error: 'You cannot review your own book' },
                { status: 403 }
            );
        }

        // Create review
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                book_id: id,
                reviewer_id: user.id,
                seller_id: book.seller_id,
                rating,
                comment: comment ? comment.trim() : null,
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                // Unique constraint violation
                return NextResponse.json(
                    { error: 'You have already reviewed this book' },
                    { status: 409 }
                );
            }
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to create review',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Review created successfully',
                data,
            },
            { status: 201 }
        );
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
