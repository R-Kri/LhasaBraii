import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch user's orders (as buyer or seller)
export async function GET(request: Request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role') || 'buyer'; // 'buyer' or 'seller'
        const status = searchParams.get('status');

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        let query = supabase
            .from('orders')
            .select(`
                id,
                status,
                price,
                buyer_phone,
                seller_phone,
                notes,
                buyer_confirmed_at,
                seller_confirmed_at,
                created_at,
                updated_at,
                book:books (
                    id,
                    title,
                    author,
                    images,
                    condition
                ),
                buyer:user_profiles!orders_buyer_id_fkey (
                    id,
                    first_name,
                    last_name,
                    phone,
                    email
                ),
                seller:user_profiles!orders_seller_id_fkey (
                    id,
                    first_name,
                    last_name,
                    phone,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        // Filter by role
        if (role === 'seller') {
            query = query.eq('seller_id', user.id);
        } else {
            query = query.eq('buyer_id', user.id);
        }

        // Filter by status if provided
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: orders, error } = await query;

        if (error) {
            console.error('Orders fetch error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch orders', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: orders || [],
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

// POST - Create a new order (from checkout)
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
        const { book_id, buyer_phone, notes } = body;

        if (!book_id) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Fetch book details
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, seller_id, price, status, title')
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

        // Can't buy your own book
        if (book.seller_id === user.id) {
            return NextResponse.json(
                { error: 'You cannot buy your own book' },
                { status: 400 }
            );
        }

        // Check if there's already an active order for this book by this buyer
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('id, status')
            .eq('book_id', book_id)
            .eq('buyer_id', user.id)
            .in('status', ['initiated', 'buyer_confirmed'])
            .single();

        if (existingOrder) {
            return NextResponse.json(
                { error: 'You already have an active order for this book', orderId: existingOrder.id },
                { status: 400 }
            );
        }

        // Get seller's phone from profile
        const { data: sellerProfile } = await supabase
            .from('user_profiles')
            .select('phone')
            .eq('id', book.seller_id)
            .single();

        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                buyer_id: user.id,
                seller_id: book.seller_id,
                book_id: book_id,
                price: book.price,
                status: 'initiated',
                buyer_phone: buyer_phone || null,
                seller_phone: sellerProfile?.phone || null,
                notes: notes || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order creation error:', orderError);
            return NextResponse.json(
                { error: 'Failed to create order', details: orderError.message },
                { status: 500 }
            );
        }

        // Remove item from cart if it exists
        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('book_id', book_id);

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            data: order,
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
