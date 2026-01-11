-- Create chat_conversations table to track buyer-seller conversations per book
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, buyer_id, seller_id)
);

-- Create chat_messages table for storing messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON chat_conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller ON chat_conversations(seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_book ON chat_conversations(book_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON chat_messages(created_at DESC);

-- Enable RLS
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
    ON chat_conversations FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create conversations"
    ON chat_conversations FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their own conversations"
    ON chat_conversations FOR UPDATE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
    ON chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = chat_messages.conversation_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations"
    ON chat_messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM chat_conversations 
            WHERE id = chat_messages.conversation_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can update read status of messages sent to them"
    ON chat_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM chat_conversations c
            WHERE c.id = chat_messages.conversation_id 
            AND (
                (c.buyer_id = auth.uid() AND chat_messages.sender_id = c.seller_id) OR
                (c.seller_id = auth.uid() AND chat_messages.sender_id = c.buyer_id)
            )
        )
    );
