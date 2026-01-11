import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                {
                    error: 'Invalid book ID format',
                },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Fetch the book
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                {
                    error: 'Book not found',
                },
                { status: 404 }
            );
        }

        // Only allow viewing approved books or own books
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (book.status !== 'approved' && user?.id !== book.seller_id) {
            return NextResponse.json(
                {
                    error: 'You do not have permission to view this book',
                },
                { status: 403 }
            );
        }

        // Fetch seller info from user profiles
        const { data: sellerProfile, error: sellerError } = await supabase
            .from('user_profiles')
            .select('id, first_name, last_name, phone, bio, profile_image, rating, total_sales')
            .eq('id', book.seller_id)
            .single();

        // Build seller info - use profile data, with auth metadata as fallback for names
        const sellerInfo = sellerProfile || {
            id: book.seller_id,
            first_name: null,
            last_name: null,
            phone: null,
            bio: null,
            profile_image: null,
            rating: 0,
            total_sales: 0,
        };


        // Fetch related books from same seller (up to 4)
        const { data: relatedBooks, error: relatedError } = await supabase
            .from('books')
            .select('id, title, price, images, condition, category')
            .eq('seller_id', book.seller_id)
            .eq('status', 'approved')
            .neq('id', id)
            .limit(4);

        return NextResponse.json({
            success: true,
            data: {
                ...book,
                seller: sellerInfo,
                relatedBooks: relatedBooks || [],
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch book',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// PUT/PATCH to update a book
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const body = await request.json();

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

        // Verify user owns the book
        const { data: existingBook } = await supabase
            .from('books')
            .select('id, seller_id, status')
            .eq('id', id)
            .single();

        if (!existingBook) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        if (existingBook.seller_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only edit your own books' },
                { status: 403 }
            );
        }

        // Only allow editing pending books
        if (existingBook.status !== 'pending') {
            return NextResponse.json(
                { error: 'Can only edit pending books' },
                { status: 400 }
            );
        }

        const { title, author, isbn, category, condition, price, description, images } = body;

        // Validate required fields
        if (!title || !author || !category || !condition || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update the book
        const { data: updatedBook, error: updateError } = await supabase
            .from('books')
            .update({
                title,
                author,
                isbn: isbn || null,
                category,
                condition,
                price: parseFloat(price),
                description: description || null,
                images: images || [],
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json(
                {
                    error: 'Failed to update book',
                    details: updateError.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Book updated successfully',
            data: updatedBook,
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
