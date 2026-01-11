import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Get messages for a conversation
export async function GET(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;
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

        // Verify user is part of the conversation
        const { data: conversation, error: convError } = await supabase
            .from('chat_conversations')
            .select(`
                id,
                book_id,
                buyer_id,
                seller_id,
                books:book_id (
                    id,
                    title,
                    images
                )
            `)
            .eq('id', conversationId)
            .single();

        if (convError || !conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
            return NextResponse.json(
                { error: 'You are not part of this conversation' },
                { status: 403 }
            );
        }

        // Get messages
        const { data: messages, error: msgError } = await supabase
            .from('chat_messages')
            .select('id, sender_id, message, is_read, created_at')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (msgError) {
            console.error('Error fetching messages:', msgError);
            return NextResponse.json(
                { error: 'Failed to fetch messages' },
                { status: 500 }
            );
        }

        // Mark messages from other party as read
        await supabase
            .from('chat_messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id)
            .eq('is_read', false);

        const isBuyer = conversation.buyer_id === user.id;

        return NextResponse.json({
            success: true,
            data: {
                conversation: {
                    ...conversation,
                    role: isBuyer ? 'buyer' : 'seller',
                    otherPartyRole: isBuyer ? 'Seller' : 'Buyer',
                },
                messages: messages?.map((msg) => ({
                    ...msg,
                    isOwn: msg.sender_id === user.id,
                    senderRole: msg.sender_id === conversation.buyer_id ? 'Buyer' : 'Seller',
                })) || [],
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// POST - Send a message
export async function POST(
    request: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const { conversationId } = await params;
        const supabase = await createClient();
        const { message } = await request.json();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Verify user is part of the conversation
        const { data: conversation, error: convError } = await supabase
            .from('chat_conversations')
            .select('id, buyer_id, seller_id')
            .eq('id', conversationId)
            .single();

        if (convError || !conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
            return NextResponse.json(
                { error: 'You are not part of this conversation' },
                { status: 403 }
            );
        }

        // Insert message
        const { data: newMessage, error: insertError } = await supabase
            .from('chat_messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                message: message.trim(),
            })
            .select('id, sender_id, message, is_read, created_at')
            .single();

        if (insertError) {
            console.error('Error sending message:', insertError);
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 500 }
            );
        }

        // Update conversation timestamp
        await supabase
            .from('chat_conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

        return NextResponse.json({
            success: true,
            data: {
                ...newMessage,
                isOwn: true,
                senderRole: user.id === conversation.buyer_id ? 'Buyer' : 'Seller',
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
