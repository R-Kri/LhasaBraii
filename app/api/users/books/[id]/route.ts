import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE a book by ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        const bookId = id;

        // First, verify that the book belongs to the current user
        const { data: book, error: fetchError } = await supabase
            .from('books')
            .select('id, seller_id, images')
            .eq('id', bookId)
            .single();

        if (fetchError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Check if the user is the seller
        if (book.seller_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You can only delete your own books' },
                { status: 403 }
            );
        }

        // Delete the book
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', bookId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return NextResponse.json(
                {
                    error: 'Failed to delete book',
                    details: deleteError.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Book deleted successfully',
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
