import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Helper to check if user is admin
async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
    
    return profile?.role === 'admin';
}

// GET - Fetch single book details for admin
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

        if (!(await isAdmin(supabase, user.id))) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const { data: book, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Fetch seller info separately
        const { data: seller } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', book.seller_id)
            .single();

        const bookWithSeller = { ...book, seller };

        // Get moderation history for this book
        const { data: moderationLogs } = await supabase
            .from('moderation_logs')
            .select(`
                id,
                action,
                notes,
                created_at,
                moderator:profiles!moderation_logs_moderator_id_fkey (
                    full_name
                )
            `)
            .eq('book_id', id)
            .order('created_at', { ascending: false });

        return NextResponse.json({
            success: true,
            data: bookWithSeller,
            moderationHistory: moderationLogs || [],
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

// PUT - Update book status (approve/reject)
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

        if (!(await isAdmin(supabase, user.id))) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { action, reason } = body; // action: 'approve' or 'reject'

        if (!action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be "approve" or "reject"' },
                { status: 400 }
            );
        }

        // Check book exists
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, status, title')
            .eq('id', id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update book status
        const { error: updateError } = await supabase
            .from('books')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updateError) {
            console.error('Book update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update book status', details: updateError.message },
                { status: 500 }
            );
        }

        // Log moderation action
        const { error: logError } = await supabase
            .from('moderation_logs')
            .insert({
                moderator_id: user.id,
                book_id: id,
                action: action === 'approve' ? 'approved' : 'rejected',
                notes: reason || null,
                previous_status: book.status,
                new_status: newStatus,
            });

        if (logError) {
            console.error('Moderation log error:', logError);
            // Don't fail the request, just log the error
        }

        return NextResponse.json({
            success: true,
            message: `Book ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            data: {
                id,
                status: newStatus,
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

// DELETE - Delete a book (admin only)
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

        if (!(await isAdmin(supabase, user.id))) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const reason = searchParams.get('reason') || 'Removed by admin';

        // Check book exists
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('id, title, status')
            .eq('id', id)
            .single();

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Log before delete
        await supabase
            .from('moderation_logs')
            .insert({
                moderator_id: user.id,
                book_id: id,
                action: 'deleted',
                notes: reason,
                previous_status: book.status,
                new_status: 'deleted',
            });

        // Delete the book
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Book delete error:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete book', details: deleteError.message },
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
