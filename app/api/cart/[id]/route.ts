import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PUT - Update cart item quantity
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

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
        const { quantity } = body;

        if (!quantity || quantity < 1) {
            return NextResponse.json(
                { error: 'Valid quantity is required (minimum 1)' },
                { status: 400 }
            );
        }

        // Verify cart item belongs to user
        const { data: cartItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            );
        }

        if (cartItem.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update quantity
        const { data: updatedItem, error: updateError } = await supabase
            .from('cart_items')
            .update({
                quantity: quantity,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update cart item', details: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Cart item updated',
            data: updatedItem,
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

// DELETE - Remove item from cart
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { id } = await params;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify cart item belongs to user
        const { data: cartItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('id, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !cartItem) {
            return NextResponse.json(
                { error: 'Cart item not found' },
                { status: 404 }
            );
        }

        if (cartItem.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Delete the item
        const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json(
                { error: 'Failed to remove item', details: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart',
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
