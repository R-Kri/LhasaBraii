import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch user's cart items
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

        const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                created_at,
                book:books (
                    id,
                    title,
                    author,
                    price,
                    images,
                    condition,
                    status,
                    seller_id
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Cart fetch error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch cart', details: error.message },
                { status: 500 }
            );
        }

        // Filter out items where book is no longer available
        const validItems = cartItems?.filter(
            (item) => {
                const book = Array.isArray(item.book) ? item.book[0] : item.book;
                return book && book.status === 'approved';
            }
        ) || [];

        // Calculate totals
        const subtotal = validItems.reduce((sum, item) => {
            const book = Array.isArray(item.book) ? item.book[0] : item.book;
            return sum + (book?.price || 0) * item.quantity;
        }, 0);

        return NextResponse.json({
            success: true,
            data: validItems,
            summary: {
                itemCount: validItems.length,
                subtotal: subtotal,
                total: subtotal, // Can add shipping/tax later
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

// POST - Add item to cart
export async function POST(request: Request) {
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

        const body = await request.json();
        const { book_id, quantity = 1 } = body;

        if (!book_id) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Verify book exists and is available
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, seller_id, status, price, title')
            .eq('id', book_id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        if (book.status !== 'approved') {
            return NextResponse.json(
                { error: 'This book is not available for purchase' },
                { status: 400 }
            );
        }

        // Prevent adding own book to cart
        if (book.seller_id === user.id) {
            return NextResponse.json(
                { error: 'You cannot add your own book to cart' },
                { status: 400 }
            );
        }

        // Check if item already exists in cart
        const { data: existingItem } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', user.id)
            .eq('book_id', book_id)
            .single();

        if (existingItem) {
            // Update quantity if already in cart
            const { data: updatedItem, error: updateError } = await supabase
                .from('cart_items')
                .update({
                    quantity: existingItem.quantity + quantity,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existingItem.id)
                .select()
                .single();

            if (updateError) {
                return NextResponse.json(
                    { error: 'Failed to update cart', details: updateError.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Cart updated',
                data: updatedItem,
            });
        }

        // Add new item to cart
        const { data: newItem, error: insertError } = await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                book_id: book_id,
                quantity: quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error('Cart insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to add to cart', details: insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Added to cart',
            data: newItem,
        }, { status: 201 });
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
