import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        
        const query = searchParams.get('q')?.trim();
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query || query.length < 2) {
            return NextResponse.json({ 
                success: true, 
                data: [],
                message: 'Query must be at least 2 characters' 
            });
        }

        // Search in title, author, and ISBN
        const { data, error } = await supabase
            .from('books')
            .select(`
                id,
                title,
                author,
                price,
                condition,
                category,
                images,
                isbn
            `)
            .eq('status', 'approved')
            .or(`title.ilike.%${query}%,author.ilike.%${query}%,isbn.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Search error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            data: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
