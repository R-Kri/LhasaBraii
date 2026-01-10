import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch single order details
export async function GET(
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

        const { data: order, error } = await supabase
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
                buyer_id,
                seller_id,
                book:books (
                    id,
                    title,
                    author,
                    images,
                    condition,
                    description,
                    isbn
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
            .eq('id', id)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify user is buyer or seller
        if (order.buyer_id !== user.id && order.seller_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Determine user's role in this order
        const userRole = order.buyer_id === user.id ? 'buyer' : 'seller';

        return NextResponse.json({
            success: true,
            data: order,
            userRole,
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

// PUT - Update order status (confirmations)
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
        const { action } = body; // 'buyer_confirm', 'seller_confirm', 'cancel'

        // Fetch current order
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('id, buyer_id, seller_id, status, book_id')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        const isBuyer = order.buyer_id === user.id;
        const isSeller = order.seller_id === user.id;

        // Verify user is involved in order
        if (!isBuyer && !isSeller) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        let updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };
        let newStatus = order.status;

        switch (action) {
            case 'buyer_confirm':
                // Buyer confirms they received the book and paid
                if (!isBuyer) {
                    return NextResponse.json(
                        { error: 'Only the buyer can confirm receipt' },
                        { status: 403 }
                    );
                }
                if (order.status !== 'initiated') {
                    return NextResponse.json(
                        { error: 'Order cannot be confirmed in current status' },
                        { status: 400 }
                    );
                }
                newStatus = 'buyer_confirmed';
                updateData = {
                    ...updateData,
                    status: newStatus,
                    buyer_confirmed_at: new Date().toISOString(),
                };
                break;

            case 'seller_confirm':
                // Seller confirms they received payment
                if (!isSeller) {
                    return NextResponse.json(
                        { error: 'Only the seller can confirm payment receipt' },
                        { status: 403 }
                    );
                }
                if (order.status !== 'buyer_confirmed') {
                    return NextResponse.json(
                        { error: 'Buyer must confirm first before seller can confirm' },
                        { status: 400 }
                    );
                }
                newStatus = 'completed';
                updateData = {
                    ...updateData,
                    status: newStatus,
                    seller_confirmed_at: new Date().toISOString(),
                };

                // Mark the book as sold
                await supabase
                    .from('books')
                    .update({ status: 'sold', updated_at: new Date().toISOString() })
                    .eq('id', order.book_id);
                break;

            case 'cancel':
                // Either party can cancel if not completed
                if (order.status === 'completed') {
                    return NextResponse.json(
                        { error: 'Completed orders cannot be cancelled' },
                        { status: 400 }
                    );
                }
                newStatus = 'cancelled';
                updateData = {
                    ...updateData,
                    status: newStatus,
                };
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }

        // Update the order
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Order update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update order', details: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Order ${action === 'cancel' ? 'cancelled' : 'updated'} successfully`,
            data: updatedOrder,
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
