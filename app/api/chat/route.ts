import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Get all conversations for the current user
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

        // Get all conversations where user is buyer or seller
        const { data: conversations, error } = await supabase
            .from('chat_conversations')
            .select(`
                id,
                book_id,
                buyer_id,
                seller_id,
                created_at,
                updated_at,
                books:book_id (
                    id,
                    title,
                    images
                )
            `)
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching conversations:', error);
            return NextResponse.json(
                { error: 'Failed to fetch conversations' },
                { status: 500 }
            );
        }

        // Get unread count and last message for each conversation
        const conversationsWithDetails = await Promise.all(
            (conversations || []).map(async (conv) => {
                // Get last message
                const { data: lastMessage } = await supabase
                    .from('chat_messages')
                    .select('message, created_at, sender_id')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // Get unread count (messages sent by the other party that are unread)
                const { count: unreadCount } = await supabase
                    .from('chat_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('conversation_id', conv.id)
                    .eq('is_read', false)
                    .neq('sender_id', user.id);

                const isBuyer = conv.buyer_id === user.id;

                return {
                    ...conv,
                    lastMessage,
                    unreadCount: unreadCount || 0,
                    role: isBuyer ? 'buyer' : 'seller',
                    otherPartyRole: isBuyer ? 'Seller' : 'Buyer',
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: conversationsWithDetails,
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// POST - Create a new conversation or get existing one
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { bookId } = await request.json();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!bookId) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        // Get the book to find the seller
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, seller_id, title')
            .eq('id', bookId)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Can't start conversation with yourself
        if (book.seller_id === user.id) {
            return NextResponse.json(
                { error: 'You cannot message yourself' },
                { status: 400 }
            );
        }

        // Check if conversation already exists
        const { data: existingConv } = await supabase
            .from('chat_conversations')
            .select('id')
            .eq('book_id', bookId)
            .eq('buyer_id', user.id)
            .eq('seller_id', book.seller_id)
            .single();

        if (existingConv) {
            return NextResponse.json({
                success: true,
                data: { conversationId: existingConv.id, isNew: false },
            });
        }

        // Create new conversation
        const { data: newConv, error: createError } = await supabase
            .from('chat_conversations')
            .insert({
                book_id: bookId,
                buyer_id: user.id,
                seller_id: book.seller_id,
            })
            .select('id')
            .single();

        if (createError) {
            console.error('Error creating conversation:', createError);
            return NextResponse.json(
                { error: 'Failed to create conversation' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { conversationId: newConv.id, isNew: true },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
