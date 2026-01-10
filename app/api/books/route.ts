import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Helper functions
const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

const validateISBN = (isbn: string): boolean => {
    if (!isbn) return true; // ISBN is optional
    const cleaned = isbn.replace(/-/g, '');
    return cleaned.length === 10 || cleaned.length === 13;
};

const validateCondition = (condition: string): boolean => {
    return ['new', 'like_new', 'good', 'fair'].includes(condition);
};

const validateCategory = (category: string): boolean => {
    return ['academic', 'competitive', 'literature', 'reference'].includes(category);
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            title,
            author,
            price,
            condition,
            category,
            images,
            isbn,
            description,
        } = body;

        // Validate required fields
        if (
            !isNonEmptyString(title) ||
            !isNonEmptyString(author) ||
            typeof price !== "number" ||
            price <= 0 ||
            !isNonEmptyString(condition) ||
            !isNonEmptyString(category) ||
            !Array.isArray(images) ||
            images.length === 0
        ) {
            return NextResponse.json(
                {
                    error: "Invalid or missing required fields",
                    details: {
                        title: !isNonEmptyString(title) ? "Title is required" : undefined,
                        author: !isNonEmptyString(author) ? "Author is required" : undefined,
                        price: typeof price !== "number" || price <= 0 ? "Price must be a positive number" : undefined,
                        condition: !isNonEmptyString(condition) ? "Condition is required" : undefined,
                        category: !isNonEmptyString(category) ? "Category is required" : undefined,
                        images: !Array.isArray(images) || images.length === 0 ? "At least one image is required" : undefined,
                    }
                },
                { status: 400 }
            );
        }

        // Validate ISBN format if provided
        if (isbn && !validateISBN(isbn)) {
            return NextResponse.json(
                {
                    error: "Invalid ISBN format",
                    details: "ISBN must be 10 or 13 digits (hyphens allowed)"
                },
                { status: 400 }
            );
        }

        // Validate condition value
        if (!validateCondition(condition)) {
            return NextResponse.json(
                {
                    error: "Invalid condition",
                    details: "Condition must be one of: new, like_new, good, fair"
                },
                { status: 400 }
            );
        }

        // Validate category value
        if (!validateCategory(category)) {
            return NextResponse.json(
                {
                    error: "Invalid category",
                    details: "Category must be one of: academic, competitive, literature, reference"
                },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Insert into database
        const { data, error } = await supabase
            .from('books')
            .insert({
                seller_id: user.id,
                title: title.trim(),
                author: author.trim(),
                isbn: isbn ? isbn.trim() : null,
                description: description ? description.trim() : null,
                price: parseFloat(price.toString()),
                condition,
                category,
                images,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: "Failed to create book listing",
                    details: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Book listing created successfully",
                book: data,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: "Failed to process request",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Query parameters
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const condition = searchParams.get('condition') || '';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100
        const offset = Math.max(0, parseInt(searchParams.get('offset') || '0'));

        const supabase = await createClient();

        // Start building query - only approved books
        let query = supabase
            .from('books')
            .select('*', { count: 'exact' })
            .eq('status', 'approved');

        // Search filter (title, author, isbn)
        if (search) {
            const searchTerm = `%${search}%`;
            query = query.or(
                `title.ilike.${searchTerm},author.ilike.${searchTerm},isbn.ilike.${searchTerm}`
            );
        }

        // Category filter
        if (category && validateCategory(category)) {
            query = query.eq('category', category);
        }

        // Condition filter
        if (condition && validateCondition(condition)) {
            query = query.eq('condition', condition);
        }

        // Price range filter
        if (minPrice) {
            const minVal = parseFloat(minPrice);
            if (!isNaN(minVal)) {
                query = query.gte('price', minVal);
            }
        }

        if (maxPrice) {
            const maxVal = parseFloat(maxPrice);
            if (!isNaN(maxVal)) {
                query = query.lte('price', maxVal);
            }
        }

        // Sorting
        const sortMap: { [key: string]: boolean } = {
            'price-asc': true,
            'price-desc': false,
            'newest': false,
            'oldest': true,
        };

        if (sortBy === 'price-asc') {
            query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-desc') {
            query = query.order('price', { ascending: false });
        } else if (sortBy === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else {
            query = query.order('created_at', { ascending: true });
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                {
                    error: 'Failed to fetch books',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: offset + limit < (count || 0),
            },
            filters: {
                search,
                category: category || null,
                condition: condition || null,
                priceRange: {
                    min: minPrice ? parseFloat(minPrice) : null,
                    max: maxPrice ? parseFloat(maxPrice) : null,
                },
                sortBy,
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