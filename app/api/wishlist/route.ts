import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch user's wishlist
export async function GET() {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('wishlists')
            .select(`
                id,
                created_at,
                book:books (
                    id,
                    title,
                    author,
                    price,
                    condition,
                    category,
                    images,
                    status
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching wishlist:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter out books that are no longer available
        const activeWishlist = data?.filter(item => {
            const book = item.book as { status?: string } | null;
            return book && book.status === 'approved';
        }) || [];

        return NextResponse.json({ 
            success: true, 
            data: activeWishlist,
            count: activeWishlist.length 
        });

    } catch (error) {
        console.error('Wishlist fetch error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// POST - Add book to wishlist
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { book_id } = await request.json();

        if (!book_id) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Check if book exists and is available
        const { data: book } = await supabase
            .from('books')
            .select('id, seller_id, status')
            .eq('id', book_id)
            .single();

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Can't wishlist your own book
        if (book.seller_id === user.id) {
            return NextResponse.json(
                { error: 'Cannot add your own book to wishlist' },
                { status: 400 }
            );
        }

        // Check if already in wishlist
        const { data: existing } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('book_id', book_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Book already in wishlist', alreadyExists: true },
                { status: 400 }
            );
        }

        // Add to wishlist
        const { data, error } = await supabase
            .from('wishlists')
            .insert({
                user_id: user.id,
                book_id: book_id,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding to wishlist:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Added to wishlist',
            data 
        });

    } catch (error) {
        console.error('Wishlist add error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const book_id = searchParams.get('book_id');

        if (!book_id) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('book_id', book_id);

        if (error) {
            console.error('Error removing from wishlist:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Removed from wishlist' 
        });

    } catch (error) {
        console.error('Wishlist remove error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
